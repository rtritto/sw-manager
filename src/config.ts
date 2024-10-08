let APP_MAP: Config = {
  SO: {
    'CCleaner <VERSION> Portable': {
      url: 'https://www.fcportables.com/ccleaner-portable',
      urlTmp: 'https://www.softpedia.com/get/Security/Secure-cleaning/CCleaner.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/CCleaner.png',
      version: '6.19.10858',
      website: 'FCPortables'
    },
    'NTLite <VERSION>': {
      url: 'https://www.softpedia.com/get/System/OS-Enhancements/NTLite.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/NTLite.png',
      download: 'https://downloads.ntlite.com/files/NTLite_setup_x64.exe',
      id: 248365,
      version: '2023.6.9292',
      website: 'Softpedia'
    },
    'WHDownloader <VERSION>': {
      url: 'https://www.softpedia.com/get/System/System-Miscellaneous/Windows-Hotfix-Downloader.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Windows-Hotfix-Downloader.png',
      download: 'https://www.pcrestore.it/download/send/51-aggiornamenti/2613-whdownloader-windows-hotfix-downloader.html',
      id: 235948,
      childNumber: 1,
      version: '0.0.2.5',
      website: 'Softpedia'
    },
    'Win Toolkit <VERSION>': {
      url: 'https://www.softpedia.com/get/System/OS-Enhancements/Windows-7-Toolkit.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Windows-7-Toolkit.png',
      download: 'https://www.pcrestore.it/download/elenco-categorie/send/45-utilityvarie/2137-win-toolkit.html',
      id: 181550,
      childNumber: 2,
      version: '2.0.6276.30646',
      website: 'Softpedia'
    },
    'MSMG Toolkit <VERSION>': {
      url: 'https://www.softpedia.com/get/Tweak/System-Tweak/MSMG-ToolKit.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/MSMG-ToolKit.png',
      urlTmp: 'https://msmgtoolkit.in/downloads.html',
      id: 256326,
      childNumber: 2,
      version: '13.4',
      website: 'Softpedia'
    },
    'LockHunter <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/File-Management/LockHunter.shtml',
      urlTmp: 'https://lockhunter.com/download.htm',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/LockHunter.png',
      download: 'https://lockhunter.com/assets/exe/lockhuntersetup_portable_<VERSION>.exe',
      versionOptions: {
        download: '"<VERSION>".split(".").slice(0,3).join("-")'
      },
      version: '3.4.3.146',
      website: 'Softpedia'
    },
    'Microsoft Activation Scripts <VERSION>': {
      imageUrl: 'https://massgrave.dev/img/logo_small.png',
      download: 'https://github.com/massgravel/Microsoft-Activation-Scripts/raw/master/MAS/Separate-Files-Version/Activators/HWID_Activation.cmd',
      owner: 'massgravel',
      repo: 'Microsoft-Activation-Scripts',
      version: '1.5',
      website: 'GitHub'
    },
    'IObit Driver Booster Pro <VERSION> Portable': {
      url: 'https://www.fcportables.com/driver-boost-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/IObit-Driver-Booster.png',
      version: '11.0.0.21',
      website: 'FCPortables'
    },
    'Geek Uninstaller <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Tweak/Uninstallers/Geek-Uninstaller-Portable.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Geek-Uninstaller.png',
      download: 'https://download2.portableapps.com/portableapps/GeekUninstallerPortable/GeekUninstallerPortable_<VERSION>.paf.exe',
      version: '1.5.1.162',
      website: 'Softpedia'
    },
    'Revo Uninstaller Pro <VERSION> Portable': {
      url: 'https://www.fcportables.com/revo-uninstaller-pro-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Revo-Uninstaller.png',
      version: '5.1.7',
      website: 'FCPortables'
    },
    'Thunderbird Supernova <VERSION> Portable': {
      url: 'https://portableapps.com/apps/internet/thunderbird_portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Mozilla-Thunderbird.png',
      download: 'https://download2.portableapps.com/portableapps/ThunderbirdPortable/ThunderbirdPortable_<VERSION>_English.paf.exe',
      version: '102.13.0',
      website: 'PortableApps'
    },
    'IObit Uninstaller PRO <VERSION> Portable': {
      url: 'https://www.fcportables.com/iobit-uninstaller-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Advanced-Uninstaller.png',
      version: '13.1.0.3',
      website: 'FCPortables'
    },
    'UltraISO Premium Edition <VERSION> Portable': {
      url: 'https://www.fcportables.com/ultraiso-premium-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/UltraISO-Media-Edition.gif',
      version: '9.7.6.3860',
      website: 'FCPortables'
    },
    'TeamViewer <VERSION>': {
      url: 'https://www.softpedia.com/get/Internet/Remote-Utils/TeamViewer-Portable.shtml',
      urlTmp: 'https://www.filecatchers.com/teamviewer-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/TeamViewer.png',
      download: 'https://download.teamviewer.com/download/TeamViewerPortable.zip',
      comment: 'filecatchers PORTABLE IS NOT UPDATED',
      version: '15.42.5',
      website: 'Softpedia'
    },
    'Cheat Engine <VERSION>': {
      url: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/Gaming-Related/Cheat-Engine.shtml',
      urlTmp: 'https://github.com/cheat-engine/cheat-engine/releases/latest',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Cheat-Engine.png',
      id: 258418,
      childNumber: 2,
      version: '7.5',
      website: 'Softpedia'
    },
    'Fan Control <VERSION> Portable': {
      urlTmp: 'https://www.softpedia.com/get/System/System-Info/FanControl-Rem0o.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/FanControl-Rem0o.png',
      owner: 'Rem0o',
      repo: 'FanControl.Releases',
      assetNumber: 0,
      version: '174',
      website: 'GitHub'
    },
    'WinSCP <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/Internet/FTP-Clients/Portable-WinSCP.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/WinSCP.gif',
      download: 'https://deac-fra.dl.sourceforge.net/project/winscp/WinSCP/<VERSION>/WinSCP-<VERSION>-Portable.zip',
      id: 79107,
      version: '6.2.3',
      website: 'Softpedia'
    },
    'VirtualBox <VERSION> Portable': {
      url: 'https://www.filecatchers.com/virtualbox-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/VirtualBox.png',
      version: '7.0.4',
      website: 'FileCatchers'
    }
  },
  Downloader: {
    'qBittorrent <VERSION> Portable': {
      url: 'https://portableapps.com/apps/internet/qbittorrent_portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/qBittorrent.png',
      download: 'https://download2.portableapps.com/portableapps/qBittorrentPortable/qBittorrentPortable_<VERSION>.paf.exe',
      version: '4.6.4',
      website: 'PortableApps'
    },
    'JDownloader 2 (r<VERSION>) Portable': {
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/JDownloader.png',
      download: 'https://github.com/EIGHTFINITE/jdownloader-portable/archive/refs/tags/<VERSION>.zip',
      owner: 'EIGHTFINITE',
      repo: 'jdownloader-portable',
      assetNumber: 0,
      urlTmp: 'https://codecpack.co/download/JDownloader-Portable.html',
      version: '17241',
      website: 'GitHub'
    },
    'youtube-dl-gui <VERSION> Portable': {
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/murrty-youtube-dl-gui.png',
      download: 'https://github.com/murrty/youtube-dl-gui/releases/download/<VERSION>/youtube-dl-gui.zip',
      owner: 'murrty',
      repo: 'youtube-dl-gui',
      assetNumber: 1,
      tagNumber: 1,
      version: '3.3.0',
      website: 'GitHub'
    },
    'yt-dlp <VERSION> Portable': {
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/yt-dlp.png',
      owner: 'yt-dlp',
      repo: 'yt-dlp',
      assetNumber: 14,
      version: '2024.03.10',
      website: 'GitHub'
    },
    'WSL2 Distro Manager <VERSION> Portable': {
      owner: 'bostrot',
      repo: 'wsl2-distro-manager',
      assetNumber: 1,
      version: '1.8.11',
      website: 'GitHub'
    }
  },
  Media: {
    'Audacity <VERSION> Portable': {
      url: 'https://portableapps.com/apps/music_video/audacity_portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Audacity.png',
      download: 'https://download2.portableapps.com/portableapps/AudacityPortable/AudacityPortable_<VERSION>.paf.exe',
      version: '3.4.2',
      website: 'PortableApps'
    },
    'mkvalidator <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Multimedia/Video/Other-VIDEO-Tools/mkvalidator.shtml',
      urlTmp: 'https://www.matroska.org/downloads/mkvalidator.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/mkvalidator.png',
      download: 'https://netix.dl.sourceforge.net/project/matroska/mkvalidator/mkvalidator-<VERSION>-win64.zip',
      id: 182912,
      childNumber: 1,
      version: '0.6.0',
      website: 'Softpedia'
    },
    'MKVToolNix <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/Multimedia/Video/Portable-MKVToolnix.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/MKVToolnix.png',
      download: 'https://mkvtoolnix.download/windows/releases/<VERSION>/mkvtoolnix-64-bit-<VERSION>.7z',
      versionOptions: {
        download: '"<VERSION>".split(".").slice(0,2).join(".")'
      },
      version: '81.0.0',
      website: 'Softpedia'
    },
    'MKVExtractGUI <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Multimedia/Video/Other-VIDEO-Tools/MKVExtractGUI-2.shtml',
      urlTmp: 'http://sourceforge.net/projects/mkvextractgui-2',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/MKVExtractGUI-2.gif',
      download: 'https://kumisystems.dl.sourceforge.net/project/mkvextractgui-2/MKVExtractGUI-<VERSION>.zip',
      id: 182912,
      childNumber: 1,
      version: '2.4.0.0',
      website: 'Softpedia'
    },
    'Blackmagic Design DaVinci Resolve Studio + Neat Video <VERSION> Portable': {
      url: 'https://www.fcportables.com/davinci-resolve-portable',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/DaVinci_Resolve_Studio.png/180px-DaVinci_Resolve_Studio.png',
      version: '18.5.1.0006',
      website: 'FCPortables'
    },
    'Inviska MKV Extract <VERSION> Portable': {
      url: 'https://www.videohelp.com/software/Inviska-MKV-Extract',
      imageUrl: 'https://taiwebs.com/upload/icons/inviska-mkv-extract30.png',
      download: 'https://www.videohelp.com/download/Inviska_MKV_Extract_<VERSION>_x86-64_Portable.7z',
      version: '11.0',
      website: 'VideoHelp'
    },
    'Rhinoceros <VERSION> Portable': {
      url: 'https://www.fcportables.com/rhino-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/RhinoCAM.png',
      version: '7.17.22102.05001',
      website: 'FCPortables'
    },
    'Spotify <VERSION> Portable': {
      url: 'https://www.filecatchers.com/spotify-windows-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Spotify.png',
      version: '1.2.25.1011',
      website: 'FileCatchers'
    },
    'Topaz Gigapixel AI <VERSION> Portable': {
      url: 'https://www.fcportables.com/topaz-gigapixel-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Gigapixel-AI.png',
      version: '6.3.3',
      website: 'FCPortables'
    },
    'FFmpeg Batch Converter <VERSION> Portable': {
      url: 'https://www.filecatchers.com/ffmpeg-batch-portable',
      urlTmp: 'https://ffmpeg-batch.sourceforge.io',
      imageUrl: 'https://a.fsdn.com/allura/p/ffmpeg-batch/icon?20db2b4f2fe89ea6fc91ff8cc1ffd10acb631fd73fc6991a7d043aa1a3397866?&w=32',
      version: '2.8.1',
      website: 'FileCatchers'
    },
    'mp3DirectCut <VERSION> Portable': {
      url: 'https://www.filecatchers.com/mp3directcut-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/mp3DirectCut.png',
      version: '2.36',
      website: 'FileCatchers'
    },
    'MKV Muxing Batch GUI <VERSION> Portable': {
      url: 'https://www.filecatchers.com/mkv-muxing-batch-portable',
      version: '2.3',
      website: 'FileCatchers'
    },
    'CorelDRAW Graphics Suite <VERSION> Portable': {
      url: 'https://www.fcportables.com/coreldraw-suite-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/CorelDRAW-Graphics-Suite.png',
      version: '24.4.0.625',
      website: 'FCPortables'
    },
    'LosslessCut <VERSION> Portable': {
      urlTmp: 'https://www.filecatchers.com/losslesscut-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/lossless-cut.png',
      owner: 'mifi',
      repo: 'lossless-cut',
      assetNumber: 11,
      version: '3.46.2',
      website: 'GitHub'
    },
    'VLC <VERSION> Portable': {
      url: 'https://portableapps.com/apps/music_video/vlc_portable',
      urlTmp1: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/Multimedia/Video/Portable-VLC-Media-Player.shtml',
      urlTmp2: 'https://www.filecatchers.com/vlc-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/VideoLAN-Client.gif',
      download: 'https://download2.portableapps.com/portableapps/VLCPortable/VLCPortable_<VERSION>.paf.exe',
      version: '3.0.20',
      website: 'PortableApps'
    }
  },
  Office: {
    'Foxit PDF Editor Pro <VERSION> Portable': {
      url: 'https://www.fcportables.com/foxit-pdf-editor-portable',
      urlTmp: 'https://www.softpedia.com/get/Office-tools/PDF/Foxit-PhantomPDF-Business.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Foxit-PhantomPDF-Business.png',
      version: '2023.1.0.15510',
      website: 'FCPortables'
    },
    'WinMerge <VERSION> Portable': {
      url: 'https://portableapps.com/apps/utilities/winmerge_portable',
      urlTmp1: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/System/File-management/Windows-Portable-Applications-Portable-WinMerge.shtml',
      urlTmp2: 'https://www.fcportables.com/winmerge-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/WinMerge.png',
      download: 'https://download2.portableapps.com/portableapps/WinMergePortable/WinMergePortable_<VERSION>.paf.exe',
      version: '2.16.30',
      website: 'PortableApps'
    },
    'WinRAR <VERSION>': {
      url: 'https://www.softpedia.com/get/Compression-tools/WinRAR.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/WinRAR.png',
      download: 'https://www.rarlab.com/rar/winrar-x64-<VERSION>.exe',
      versionOptions: {
        download: '"<VERSION>".split(".").join("")'
      },
      version: '6.24',
      website: 'Softpedia'
    },
    '7-Zip <VERSION> Portable': {
      url: 'https://www.filecatchers.com/7zip-portable',
      urlTmp1: 'https://portableapps.com/apps/utilities/7-zip_portable',
      urlTmp2: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/Compression-Tools/Windows-Portable-Applications-7-Zip-Portable.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/7-Zip.png',
      download: 'https://download2.portableapps.com/portableapps/7-ZipPortable/7-ZipPortable_<VERSION>.paf.exe',
      versionOptions: {
        download: '"<VERSION>"'
      },
      version: '23.01',
      website: 'FileCatchers'
    },
    'Bulk Rename Utility <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/System/File-management/Portable-Bulk-Rename-Utility.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Bulk-Rename-Utility.png',
      download: 'https://www.s3.tgrmn.com/bru/BRU_NoInstall.zip',
      version: '3.4.4.0',
      website: 'Softpedia'
    }
  },
  Tools: {
    'NirSoft BlueScreenView <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/Back-Up-and-Recovery/BlueScreenView.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/blue_screen_view.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/BlueScreenView.png',
      download: 'https://www.nirsoft.net/utils/bluescreenview-x64.zip',
      version: '1.55',
      website: 'Softpedia'
    },
    'NirSoft BulkFileChanger <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/File-Management/BulkFileChanger.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/bulk_file_changer.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/BulkFileChanger.gif',
      download: 'https://www.nirsoft.net/utils/bulkfilechanger-x64.zip',
      version: '1.73',
      website: 'Softpedia'
    },
    'NirSoft FileTypesMan <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/File-Management/FileTypesMan.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/file_types_manager.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/FileTypesMan.png',
      download: 'https://www.nirsoft.net/utils/filetypesman-x64.zip',
      version: '2.00',
      website: 'Softpedia'
    },
    'NirSoft HashMyFiles <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/File-Management/HashMyFiles.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/hash_my_files.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/HashMyFiles.png',
      download: 'https://www.nirsoft.net/utils/hashmyfiles-x64.zip',
      version: '2.44',
      website: 'Softpedia'
    },
    'NirSoft HTTPNetworkSniffer <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Network-Tools/Network-IP-Scanner/HTTPNetworkSniffer.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/http_network_sniffer.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/HTTPNetworkSniffer.gif',
      download: 'https://www.nirsoft.net/utils/httpnetworksniffer-x64.zip',
      version: '1.63',
      website: 'Softpedia'
    },
    'NirSoft Mail PassView <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Security/Decrypting-Decoding/Mail-PassView.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/mailpv.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Mail-PassView.png',
      download: 'https://www.nirsoft.net/toolsdownload/mailpv.zip',
      version: '1.92',
      website: 'Softpedia'
    },
    'NirSoft MozillaCacheView <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Internet/Other-Internet-Related/MozillaCacheView.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/mozilla_cache_viewer.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/MozillaCacheView.png',
      download: 'https://www.nirsoft.net/utils/mzcacheview.zip',
      version: '2.21',
      website: 'Softpedia'
    },
    'NirSoft OpenWithView <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/OpenWithView.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/open_with_view.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/OpenWithView.gif',
      download: 'https://www.nirsoft.net/utils/openwithview.zip',
      version: '1.11',
      website: 'Softpedia'
    },
    'NirSoft ProduKey <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/System-Info/ProduKey.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/product_cd_key_viewer.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/ProduKey.gif',
      download: 'https://www.nirsoft.net/utils/produkey-x64.zip',
      version: '1.97',
      website: 'Softpedia'
    },
    'NirSoft RunAsDate <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/Launchers-Shutdown-Tools/RunAsDate.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/run_as_date.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/RunAsDate.png',
      download: 'https://www.nirsoft.net/utils/runasdate-x64.zip',
      version: '1.41',
      website: 'Softpedia'
    },
    'NirSoft SearchMyFiles <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/File-Management/SearchMyFiles.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/search_my_files.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/SearchMyFiles.png',
      download: 'https://www.nirsoft.net/utils/searchmyfiles-x64.zip',
      version: '3.25',
      website: 'Softpedia'
    },
    'NirSoft ShellExView <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/File-Management/ShellExView.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/shexview.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/ShellExView.gif',
      download: 'https://www.nirsoft.net/utils/shexview-x64.zip',
      version: '2.01',
      website: 'Softpedia'
    },
    'NirSoft ShellMenuNew <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/OS-Enhancements/ShellMenuNew.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/shell_menu_new.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/ShellMenuNew.gif',
      download: 'https://www.nirsoft.net/utils/shellmenunew.zip',
      version: '1.02',
      website: 'Softpedia'
    },
    'NirSoft ShellMenuView <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/System-Miscellaneous/ShellMenuView.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/shell_menu_view.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/ShellMenuView.gif',
      download: 'https://www.nirsoft.net/utils/shmnview-x64.zip',
      version: '1.41',
      website: 'Softpedia'
    },
    'NirSoft SmartSniff <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/Network/Portable-SmartSniff.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/smsniff.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Portable-SmartSniff.gif',
      download: 'https://www.nirsoft.net/utils/smsniff-x64.zip',
      version: '2.30',
      website: 'Softpedia'
    },
    'NirSoft UninstallView <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Tweak/Uninstallers/UninstallView.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/uninstall_view.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/UninstallView.png',
      download: 'https://www.nirsoft.net/utils/uninstallview-x64.zip',
      version: '1.51',
      website: 'Softpedia'
    },
    'NirSoft WifiInfoView <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Network-Tools/Misc-Networking-Tools/WifiInfoView.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/wifi_information_view.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/WifiInfoView.png',
      download: 'https://www.nirsoft.net/utils/wifiinfoview-x64.zip',
      version: '2.93',
      website: 'Softpedia'
    },
    'NirSoft WirelessKeyView <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Security/Decrypting-Decoding/WirelessKeyView.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/wireless_key.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/WirelessKeyView.png',
      download: 'https://www.nirsoft.net/toolsdownload/wirelesskeyview-x64.zip',
      comment: 'password:WKey4567#',
      version: '2.23',
      website: 'Softpedia'
    },
    'NirSoft WirelessNetView <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Network-Tools/Network-Monitoring/WirelessNetView.shtml',
      urlTmp: 'https://www.nirsoft.net/utils/wireless_network_view.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/WirelessNetView.gif',
      download: 'https://www.nirsoft.net/utils/wirelessnetview.zip',
      version: '1.75',
      website: 'Softpedia'
    },
    'Universal Extractor 2 RC 3 Portable': {
      urlTmp: 'https://www.softpedia.com/get/Compression-tools/Universal-Extractor-Bioruebe.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Universal-Extractor-Bioruebe.gif',
      owner: 'Bioruebe',
      repo: 'UniExtract2',
      assetNumber: 0,
      version: '2.0.0 RC 3',
      website: 'GitHub'
    }
  },
  Browser: {
    'Opera One <VERSION> Portable': {
      url: 'https://portableapps.com/apps/internet/opera_portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Opera-for-Windows-without-Java.png',
      download: 'https://download2.portableapps.com/portableapps/OperaPortable/OperaPortable_<VERSION>.paf.exe',
      version: '112.0.5197.39',
      website: 'PortableApps'
    },
    'Tor Browser <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Security/Security-Related/Tor-Browser.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Tor-Browser.png',
      download: 'https://dist.torproject.org/torbrowser/<VERSION>/tor-browser-windows-x86_64-portable-<VERSION>.exe',
      version: '13.5.2',
      versionOptions: {
        download: '"<VERSION>".split(" / ").at(0)',
        title: '"<VERSION>".split(" / ").at(0)'
      },
      website: 'Softpedia'
    }
  },
  Emulator: {
    'MEmu <VERSION>': {
      url: 'https://www.softpedia.com/get/Mobile-Phone-Tools/Others/MEmu.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/MEmu.png',
      download: 'https://dl.memuplay.com/download/Memu-Setup.exe',
      version: '9.0.2',
      website: 'Softpedia'
    },
    'PSPSPP <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/Other-Portable-Applications/PPSSPP-Portable.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/PPSSPP-Portable.png',
      download: 'https://www.ppsspp.org/files/<VERSION>/ppsspp_win.zip',
      versionOptions: {
        download: '"<VERSION>".split(".").join("_")'
      },
      version: '1.15.4',
      website: 'Softpedia'
    },
    'NoxPlayer <VERSION>': {
      url: 'https://www.softpedia.com/get/Mobile-Phone-Tools/Others/Nox-APP-Player.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Nox-APP-Player.png',
      download: 'https://en.bignox.com/en/download/fullPackage',
      version: '7.0.5.8',
      website: 'Softpedia'
    },
    'NSC_Builder <VERSION>': {
      owner: 'julesontheroad',
      repo: 'NSC_BUILDER',
      assetNumber: 1,
      version: '1.01b',
      website: 'GitHub'
    },
    'JoyToKey <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/Tweak/System-Tweak/JoyToKey.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/JoyToKey.png',
      download: 'https://joytokey.net/download/JoyToKeySetup_en.exe',
      version: '6.9.1.535',
      website: 'Softpedia'
    },
    'X360CE <VERSION> Portable': {
      url: 'https://www.x360ce.com',
      urlTmp: 'https://games.softpedia.com/get/Tools/x360ce.shtml',
      imageUrl: 'https://games-cdn.softpedia.com/screenshots/ico/x360ce.gif',
      download: 'https://www.x360ce.com/files/x360ce.zip',
      owner: 'x360ce',
      repo: 'x360ce',
      assetNumber: 1,
      comment: 'LATEST GITHUB RELEASE IS OUTDATED',
      version: '4.17.15.0',
      website: 'GitHub'
    }
  },
  Dev: {
    'Robo 3T <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/Database-Utils/Portable-Robo-3T.shtml',
      urlTmp: 'https://github.com/Studio3T/robomongo/releases/latest',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Portable-Robo-3T.png',
      version: '1.4.4',
      website: 'Softpedia',
      websiteTmp: 'GitHub'
    },
    'Studio 3T <VERSION>': {
      url: 'https://www.softpedia.com/get/Internet/Servers/Database-Utils/Studio-3T.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Studio-3T.png',
      downloadTmp: 'https://download.studio3t.com/studio-3t/windows/<VERSION>/studio-3t-x64.zip',
      versionOptions: {
        download: '"<VERSION>"'
      },
      version: '2023.5.0',
      website: 'Softpedia'
    },
    'XAMPP <VERSION>': {
      url: 'https://www.softpedia.com/get/Internet/Servers/Server-Tools/XAMPP.shtml',
      urlTmp: 'https://www.apachefriends.org/index.html',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/XAMPP.gif',
      download: 'https://netcologne.dl.sourceforge.net/project/xampp/XAMPP%20Windows/<VERSION>/xampp-windows-x64-<VERSION>-0-VS16-installer.exe',
      id: 32107,
      childNumber: 2,
      version: '8.2.4',
      versionOptions: {
        title: '"<VERSION>".split(" / ").at(0).split("-").at(0)',
        download: '"<VERSION>".split(" / ").at(0).split("-").at(0)'
      },
      website: 'Softpedia'
    },
    'Postman <VERSION> Portable': {
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Postman-Postdot.png',
      owner: 'portapps',
      repo: 'postman-portable',
      assetNumber: 2,
      version: '11.6.1',
      versionOptions: {
        title: '"<VERSION>".split("-").at(0)',
        download: '"<VERSION>".split("-").join("-")'
      },
      website: 'GitHub'
    }
  },
  Info: {
    'AIDA64 Engineer Edition <VERSION> Portable': {
      url: 'https://www.fcportables.com/aida64-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/AIDA64-Engineer.gif',
      version: '6.90.6500',
      website: 'FCPortables'
    },
    'CrystalDiskInfo <VERSION> Portable': {
      url: 'https://portableapps.com/apps/utilities/crystaldiskinfo_portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/CrystalDiskInfo.png',
      download: 'https://download2.portableapps.com/portableapps/CrystalDiskInfoPortable/CrystalDiskInfoPortable_<VERSION>.paf.exe',
      version: '9.2.1',
      website: 'PortableApps'
    },
    'HWiNFO64 <VERSION> Portable': {
      url: 'https://portableapps.com/apps/utilities/hwinfo-portable',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/HWiNFO64.png',
      download: 'https://download2.portableapps.com/portableapps/HWiNFOPortable/HWiNFOPortable_<VERSION>_English.paf.exe',
      version: '7.50.5150',
      website: 'PortableApps'
    },
    'HWMonitor <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/System/System-Info/Portable-HWMonitor.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Portable-HWMonitor.png',
      download: 'https://download.cpuid.com/hwmonitor/hwmonitor_<VERSION>.zip',
      version: '1.51.0',
      versionOptions: {
        download: '"<VERSION>".split(".").slice(0,3).join("-")'
      },
      website: 'Softpedia'
    },
    'Process Explorer <VERSION> Portable': {
      url: 'https://www.softpedia.com/get/System/System-Info/Process-Explorer.shtml',
      urlTmp1: 'https://portableapps.com/apps/utilities/process-explorer-portable',
      urlTmp2: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/System/System-Info/Process-Explorer-Portable.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Process-Explorer.png',
      download: 'https://download.sysinternals.com/files/ProcessExplorer.zip',
      version: '17.04',
      website: 'Softpedia'
    }
  },
  VPN: {
    'OpenVPN <VERSION>': {
      url: 'https://www.softpedia.com/get/Security/Security-Related/OpenVPN.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/OpenVPN.png',
      download: 'https://swupdate.openvpn.org/community/releases/OpenVPN-<VERSION>-amd64.msi',
      version: '2.6.6',
      versionOptions: {
        title: '"<VERSION>".split(" ").at(0)',
        download: '"<VERSION>".split(" ").join("-")'
      },
      website: 'Softpedia'
    },
    'TomVPN <VERSION> Portable': {
      url: 'https://www.filecatchers.com/tomvpn-portable',
      urlTmp: 'https://www.softpedia.com/get/Internet/Secure-Browsing-VPN/TomVPN.shtml',
      imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/TomVPN.png',
      version: '2.3.8',
      website: 'FCPortables'
    }
  }
}

export default APP_MAP