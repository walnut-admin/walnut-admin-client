import type {
  ValueOfAppConstBasicMode,
  ValueOfAppConstCollapseMode,
  ValueOfAppConstColorMode,
  ValueOfAppConstLayoutMode,
  ValueOfAppConstLockMode,
  ValueOfAppConstScrollMode,
} from '../src/const/app'
import type {
  ValueOfAppConstTabAffixMode,
  ValueOfAppConstTabCloseMode,
  ValueOfAppConstTabStyleMode,
  ValueOfAppConstTabUtilsShowMode,
} from '../src/const/tab'
/**
 * https://github.com/YousefED/typescript-json-schema
 * this interface is also used to generate json schema
 * if change this file, please in terminal run `npm run gen:schema` to generate `settings.json` VS Code support
 * all types below must be explicit import, no auto-import or global usage
 */
import type { ValueOfAppConstTransitionName } from '../src/const/transition'

interface AppSettingsForApp {
  /**
   * DX config
   * App Layout
   * @default left-menu
   */
  layout: ValueOfAppConstLayoutMode

  /**
   * DX config
   * Keep Alive component, vue features
   * @default true
   */
  keepAlive: boolean

  /**
   * DX config
   * Content padding px
   * @default 2
   */
  contentPadding: number

  /**
   * DX config
   * Url Masking Features
   * true => make route query unreadable
   * @default false
   */
  urlMasking: boolean

  /**
   * DX config
   * Transition Component, vue features
   * @default true
   */
  transitionStatus: boolean

  /**
   * DX config
   * Transition Mode
   * 'global' => use `transitionName` for transition name
   * 'scope' => use the transition info in route `meta` object
   * @default scope
   */
  transitionMode: ValueOfAppConstBasicMode

  /**
   * DX config
   * Global Transition Name
   * Only works when `transitionMode` => 'global'
   * @default fade
   */
  transitionName: ValueOfAppConstTransitionName

  /**
   * DX config
   * Watermark features on use or not
   * @default true
   */
  watermarkStatus: boolean

  /**
   * DX config
   * Watermark Mode
   * 'global' => use `watermarkContent` for watermark content
   * 'scope' => use the watermark info in route `meta` object
   * @default scope
   */
  watermarkMode: ValueOfAppConstBasicMode

  /**
   * DX config
   * Global Watermark Content
   * Only works when `watermarkMode` => 'global'
   * @default walnut-admin
   */
  watermarkContent: string

  /**
   * DX config
   * Lock Features on use or not
   * @default true
   */
  lockStatus: boolean

  /**
   * DX config
   * Lock Mode
   * 'default' => user can manually to lock tha application
   * 'security' => more secure usage, app would lock when user's mouse leave the app or change the browser/system tabs
   * 'idle' => app would auto lock when user is idle for some time
   * @default default
   */
  lockMode: ValueOfAppConstLockMode

  /**
   * DX config
   * User inactive seconds to lock app
   * @default 5
   */
  lockIdleSeconds: number

  /**
   * DX config
   * use event listener to hijack the refresh action and use redirect to refresh the current route
   * @default true
   */
  hijackRefresh: boolean

  /**
   * UX config
   * just different css tricks to fitler the app in view
   * @default default
   */
  colorMode: ValueOfAppConstColorMode

  /**
   * UX config
   * for those who cannot see animation viewing the internet
   * @default false
   */
  reducedMotion: boolean

  /**
   * DX config
   * content or wrapper, scrollbar may have part covered in wrapper mode
   * @default content
   */
  scrollMode: ValueOfAppConstScrollMode

  /**
   * TODO
   * UX config
   * should provide several configs like 10px/12px/14px/16px/18px/20px
   * @default 16
   */
  // baseFontSize: number
}

interface AppSettingsForTheme {
  light: {
    primaryColor: string
    infoColor: string
    successColor: string
    warningColor: string
    errorColor: string
    bodyColor: string
    invertedColor: string
  }
  dark: {
    primaryColor: string
    infoColor: string
    successColor: string
    warningColor: string
    errorColor: string
    bodyColor: string
    invertedColor: string
  }
}

interface AppSettingsForLogo {
  /**
   * Dom id
   */
  id: string

  /**
   * True => fixed, false => normal
   */
  fixed: boolean

  /**
   * True => using, false => hidden
   */
  status: boolean

  /**
   * Logo transition name
   */
  transition: ValueOfAppConstTransitionName
}

interface AppSettingsForHeader {
  /**
   * Dom id
   */
  id: string

  /**
   * True => fixed, false => normal
   */
  fixed: boolean

  /**
   * True => using, false => hidden
   */
  status: boolean

  /**
   * Header transition name
   */
  transition: ValueOfAppConstTransitionName

  /**
   * Header inverted
   */
  inverted: boolean

  /**
   * Header height
   */
  height: number

  /**
   * Header utils - full screen visibility
   */
  fullscreen: boolean

  /**
   * Header utils - search visibility
   */
  search: boolean

  /**
   * when header is not fixed, set true to show header when scroll up
   * @default true
   */
  scrollUpShow: boolean

  /**
   * when header is not fixed and scrollUpShow is true, set true to keep the header alive when hover
   * @default true
   */
  liveOnHover: boolean
}

interface AppSettingsForTabs {
  /**
   * Dom id
   */
  id: string

  /**
   * True => fixed, false => normal
   */
  fixed: boolean

  /**
   * True => using, false => hidden
   */
  status: boolean

  /**
   * Tabs inverted
   */
  inverted: boolean

  /**
   * Tabs transition name
   */
  transition: ValueOfAppConstTransitionName

  /**
   * Tab height
   */
  height: number

  /**
   * Tab item width
   */
  itemWidth: number

  /**
   * Tab icon visibility
   */
  showIcon: boolean

  /**
   * Tab aside utils visibility
   */
  showUtils: boolean

  /**
   * Tab aside utils display mode
   */
  utilsMode: ValueOfAppConstTabUtilsShowMode

  /**
   * Tab context menu visibility
   */
  contextMenu: boolean

  /**
   * Tab sortable
   */
  sortable: boolean

  /**
   * Tab style mode
   */
  styleMode: ValueOfAppConstTabStyleMode

  /**
   * With persistent support
   */
  persistent: boolean

  /**
   * Tab item animation name
   */
  itemTransition: ValueOfAppConstTransitionName

  /**
   * Tab close mode
   */
  closeMode: ValueOfAppConstTabCloseMode

  /**
   * Tab affix mode
   */
  affixMode: ValueOfAppConstTabAffixMode

  /**
   * when header is not fixed, set true to show header when scroll up
   * @default true
   */
  scrollUpShow: boolean

  /**
   * when header is not fixed and scrollUpShow is true, set true to keep the header alive when hover
   * @default true
   */
  liveOnHover: boolean
}

interface AppSettingsForBreadcrumb {
  /**
   * Dom id
   */
  id: string

  /**
   * True => using, false => hidden
   */
  status: boolean

  /**
   * Breadcrumb transition name
   */
  transition: ValueOfAppConstTransitionName

  /**
   * Breadcrumb icon visibility
   */
  showIcon: boolean

  /**
   * Breadcrumb dropdown visibility
   */
  showDropdown: boolean

  /**
   * Breadcrumb custom separator
   */
  separator: string
}

interface AppSettingsForMenu {
  /**
   * Dom id
   */
  id: string

  /**
   * True => using, false => hidden
   */
  status: boolean

  /**
   * Menu transition name
   */
  transition: ValueOfAppConstTransitionName

  /**
   * Menu inverted color
   */
  inverted: boolean

  /**
   * When app layout is `left-menu`, menu width
   */
  width: number

  /**
   * Menu accordion
   */
  accordion: boolean

  /**
   * Menu icon size
   */
  iconSize: number

  /**
   * Menu indent
   */
  indent: number

  /**
   * Show collapse button
   */
  collapseStatus: boolean

  /**
   * Menu collapsed icon size
   */
  collapsedIconSize: number

  /**
   * Menu Collapse Mode
   */
  collapseMode: ValueOfAppConstCollapseMode

  /**
   * When app layout is `left-menu`, menu collapsed width
   */
  collapsedWidth: number
}

interface AppSettingsForFooter {
  /**
   * Dom id
   */
  id: string

  /**
   * True => fixed, false => normal
   */
  fixed: boolean

  /**
   * True => using, false => hidden
   */
  status: boolean

  /**
   * Footer inverted
   */
  inverted: boolean

  /**
   * Footer transition name
   */
  transition: ValueOfAppConstTransitionName

  /**
   * Footer height
   */
  height: number

  /**
   * Footer content
   */
  content: string
}

export interface AppSettings {
  app: AppSettingsForApp

  themes: AppSettingsForTheme

  logo: AppSettingsForLogo

  header: AppSettingsForHeader

  tabs: AppSettingsForTabs

  breadcrumb: AppSettingsForBreadcrumb

  menu: AppSettingsForMenu

  footer: AppSettingsForFooter
}
