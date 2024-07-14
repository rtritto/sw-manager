import querystring from 'node:querystring'
import { decode } from 'html-entities'
import { type HTMLElement, parse } from 'node-html-parser'
import { fetch, request, FormData, type Dispatcher } from 'undici'

import applyRegex from './funcs/apply-regex'
import applyVersionOption from './funcs/apply-version-option'
import { REGEX_GET_VERSION } from './Regexes'
import PARSE_OPTIONS from './PARSE_OPTIONS'

const getHTML = async (url: string): Promise<HTMLElement> => {
  const data = await fetch(url).then((res) => res.text())
  // const data = await request(url).then((res) => res.body.text())
  return parse(data, PARSE_OPTIONS)
}

const getFilteredVersion = (currentVersion: string, newestVersions: string[]): string => {
  const dotNumberLen = currentVersion.split('.').length

  const filteredVersion = newestVersions.find((v) => v.split('.').length === dotNumberLen)!

  return filteredVersion
}

export const getVersion = async (obj: NestedConfig): Promise<Info> => {
  const { website, version } = obj

  // if (!website) {
  //   // IGNORE
  //   return {}
  // }

  let titleVersion: string | undefined
  let ogImageContent: string | undefined
  let fileUrl: string | undefined
  switch (website) {
    case 'FileCatchers':
    case 'FCPortables': {
      const html = await getHTML(obj.url!)
      const title = html.querySelector('title')
      const title_raw = title?.rawText
      titleVersion = title_raw?.match(REGEX_GET_VERSION)?.at(0)

      const meta = html.querySelector('meta[property="og:image"]')
      ogImageContent = meta?.getAttribute('content')

      const content = html.querySelector('#content')
      const lastP = content!.querySelector('p:last-of-type')
      const a = lastP!.querySelector('a')
      const urlUploadrar = a!.getAttribute('href')
      if (!urlUploadrar) {
        throw new Error('Missing urlUploadrar')
      }
      fileUrl = urlUploadrar
      break
    }
    case 'PortableApps': {
      const html = await getHTML(obj.url!)

      const downloadInfo = html.querySelector('p.download-info')
      // const [downloadInfoCN] = downloadInfo.childNodes
      // return downloadInfoCN.rawText  // Version <VERSION> for Windows Multilingual
      const downloadInfoAs = downloadInfo!.querySelectorAll('a')
      const downloadInfoA = downloadInfoAs!.find((a) => a.childNodes[0].rawText === 'Antivirus Scan')
      const downloadInfoAHref = downloadInfoA!.rawAttrs
      const { v } = querystring.parse(decode(downloadInfoAHref)) as { v: string } // convert "&amp" to "&"
      titleVersion = v
      const { download } = obj
      if (download) {
        fileUrl = applyRegex(download, { version: titleVersion })
      } else {
        throw new Error('PortableApps: missing download')
      }
      break
    }
    case 'Softpedia': {
      const html = await getHTML(obj.url!)

      const h2 = html.querySelector('h2.sanscond.curpo')
      const strong = h2!.querySelector('strong')
      const strongCN = strong!.childNodes.at(0)
      const rawVersion = strongCN!.rawText
      titleVersion = applyVersionOption(rawVersion, obj.versionOptions?.title!) as string
      const { download } = obj
      if (download) {
        fileUrl = applyRegex(download, { version: applyVersionOption(rawVersion, obj.versionOptions?.download!) as string })
      } else {
        throw new Error('Softpedia: missing download')
      }
      break
      // TODO

      const fd = new FormData()
      fd.append('t', 15)
      fd.append('id', obj.id!)
      fd.append('tsf', 0)
      const htmlDlInfo = await fetch('https://www.softpedia.com/_xaja/dlinfo.php?skipa=0', {
        body: fd,
        method: 'POST'
      }).then((res) => res.text())
      const rootDlInfo = parse(htmlDlInfo, PARSE_OPTIONS)
      const muhscroll = rootDlInfo.querySelector('#muhscroll')
      const div = muhscroll!.querySelector(`div.dllinkbox2:nth-child(${obj.childNumber!})`)
      const a = div!.querySelector('a')
      const href = a!.getAttribute('href')

      // TODO get new page and scrape the setup link
      // await fetch(href)
      break
    }
    case 'GitHub': {
      const { owner, repo, tagNumber } = obj
      let response: Dispatcher.ResponseData | undefined
      if (!tagNumber) {
        response = await request(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
          headers: {
            'User-Agent': `UA/${Date.now().toString()}`
          }
        })
      }
      let data: GithubTag
      if (response && response.statusCode === 200) {
        data = await response.body.json() as GithubTag
      } else {
        // Not Found
        // no redirect to /latest/<LATEST_TAG>
        // but is redirected to /releases because latest tag is missing
        const responseTagsRaw = await request(`https://api.github.com/repos/${owner}/${repo}/tags`, {
          headers: {
            'User-Agent': `UA/${Date.now().toString()}`
          }
        })
        if (responseTagsRaw.statusCode !== 200) {
          throw new Error('Missing tags')
        }
        const responseTags = await responseTagsRaw.body.json() as GithubTags
        const firstTag = responseTags.at(obj.tagNumber ?? 0)!
        const tag = firstTag.name
        const responseTagRaw = await request(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`, {
          headers: {
            'User-Agent': `UA/${Date.now().toString()}`
          }
        })
        if (responseTagRaw.statusCode === 200) {
          data = await responseTagRaw.body.json() as GithubTag
        } else {
          data = { tag_name: tag } as GithubTag
          const { download } = obj
          if (!download) {
            throw new Error('Missing download')
          }
        }
      }
      if (!data.tag_name) {
        throw new Error('Missing tag_name')
      }
      titleVersion = data.tag_name?.match(REGEX_GET_VERSION)?.at(0)!
      const { download } = obj
      fileUrl = download
        ? applyRegex(download, { version: titleVersion })
        : data.assets[obj.assetNumber!].browser_download_url
      break
    }
    // case 'VideoHelp':
    default: {
      const { url } = obj
      if (!url) {
        throw new Error('Missing url')
      }
      const html = await getHTML(url)

      const title = html.querySelector('title')!.rawText
      // clean version
      const newestVersions = [...title.matchAll(/[\d.]+/g)].flat()
      titleVersion = getFilteredVersion(version, newestVersions)
      const { download } = obj
      if (download) {
        fileUrl = applyRegex(download, { version: titleVersion })
      } else {
        throw new Error('default: missing download')
      }
    }
  }
  return {
    website,
    isVersionUpdated: titleVersion === version,
    currentVersion: version,
    newVersion: titleVersion,
    imageUrl: ogImageContent,
    fileUrl
  }
}

/**
 * @returns fileUrl
 *  https://github.com/<OWNER>/<REPO>/releases/download/<RELEASE_TAG>/<FILE>.<EXTENSION>
 *  https://fs21.uploadrar.com:183/d/<RANDOM_ALPHANUMERIC>/<FILE>.<EXTENSION>
 */
export const getDownloadLink = async (info: Info): Promise<string> => {
  const { website, fileUrl } = info

  switch (website) {
    case 'FileCatchers':
    case 'FCPortables': {
      const fileId = fileUrl!.split('/').at(-1)
      const htmlUploadrar = await fetch(fileUrl!, {
        headers: {
          // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0',
          // Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          // 'Accept-Language': 'en-US,en;q=0.5',
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Upgrade-Insecure-Requests': '1',
          // 'Sec-Fetch-Dest': 'document',
          // 'Sec-Fetch-Mode': 'navigate',
          // 'Sec-Fetch-Site': 'same-origin'
        },
        body: `op=download2&id=${fileId}&rand=&referer=https%3A%2F%2Fuploadrar.com&method_free=Free+Download&adblock_detected=0`,
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        referrer: fileUrl!
      }).then((res) => res.text())
      return htmlUploadrar.match(/<a href="([^"]+"?uploadrar.com:[^"]+)"/)?.at(1)!
    }
    // case 'PortableApps':
    // case 'Softpedia':
    // case 'GitHub':
    // case 'VideoHelp':
    default:
      return info.fileUrl!
  }
}

// TODO remove
const getVersionAndFileUrl = async () => { }
export default getVersionAndFileUrl