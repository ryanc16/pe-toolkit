[pe-toolkit](../README.md) / [Exports](../modules.md) / PeFileParser

# Class: PeFileParser

## Table of contents

### Constructors

- [constructor](PeFileParser.md#constructor)

### Properties

- [RT\_RESOURCE\_TYPES](PeFileParser.md#rt_resource_types)

### Methods

- [getAcceleratorTableResources](PeFileParser.md#getacceleratortableresources)
- [getAnimatedCursorResources](PeFileParser.md#getanimatedcursorresources)
- [getAnimatedIconResources](PeFileParser.md#getanimatediconresources)
- [getBitmapResources](PeFileParser.md#getbitmapresources)
- [getCursorResources](PeFileParser.md#getcursorresources)
- [getDataDirectory](PeFileParser.md#getdatadirectory)
- [getDataDirectoryTypes](PeFileParser.md#getdatadirectorytypes)
- [getDialogIncludeResources](PeFileParser.md#getdialogincluderesources)
- [getDialogResources](PeFileParser.md#getdialogresources)
- [getDosHeader](PeFileParser.md#getdosheader)
- [getFileHeader](PeFileParser.md#getfileheader)
- [getFontDirectoryResources](PeFileParser.md#getfontdirectoryresources)
- [getFontResources](PeFileParser.md#getfontresources)
- [getGroupCursorResources](PeFileParser.md#getgroupcursorresources)
- [getGroupIconResources](PeFileParser.md#getgroupiconresources)
- [getHTMLResources](PeFileParser.md#gethtmlresources)
- [getIconResources](PeFileParser.md#geticonresources)
- [getImage](PeFileParser.md#getimage)
- [getImportDirectoryTable](PeFileParser.md#getimportdirectorytable)
- [getLanguageIds](PeFileParser.md#getlanguageids)
- [getManifestResources](PeFileParser.md#getmanifestresources)
- [getMenuResources](PeFileParser.md#getmenuresources)
- [getMessageTableResource](PeFileParser.md#getmessagetableresource)
- [getOptionalHeader](PeFileParser.md#getoptionalheader)
- [getPlugAndPlayResources](PeFileParser.md#getplugandplayresources)
- [getRCDataResurces](PeFileParser.md#getrcdataresurces)
- [getResourceDirectoryTable](PeFileParser.md#getresourcedirectorytable)
- [getResourceTypes](PeFileParser.md#getresourcetypes)
- [getResourcesOfType](PeFileParser.md#getresourcesoftype)
- [getSectionHeader](PeFileParser.md#getsectionheader)
- [getSectionHeaders](PeFileParser.md#getsectionheaders)
- [getStringTableResources](PeFileParser.md#getstringtableresources)
- [getVersionInfoResources](PeFileParser.md#getversioninforesources)
- [getVirtualDeviceResources](PeFileParser.md#getvirtualdeviceresources)
- [parseBytes](PeFileParser.md#parsebytes)
- [parseFile](PeFileParser.md#parsefile)
- [setDefaultLanguage](PeFileParser.md#setdefaultlanguage)

## Constructors

### constructor

• **new PeFileParser**()

#### Defined in

[pe-file-parser.ts:39](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L39)

## Properties

### RT\_RESOURCE\_TYPES

▪ `Static` **RT\_RESOURCE\_TYPES**: typeof `RT_RESOURCE_TYPES` = `RT_RESOURCE_TYPES`

#### Defined in

[pe-file-parser.ts:37](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L37)

## Methods

### getAcceleratorTableResources

▸ **getAcceleratorTableResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:301](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L301)

___

### getAnimatedCursorResources

▸ **getAnimatedCursorResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:382](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L382)

___

### getAnimatedIconResources

▸ **getAnimatedIconResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:386](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L386)

___

### getBitmapResources

▸ **getBitmapResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:220](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L220)

___

### getCursorResources

▸ **getCursorResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:216](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L216)

___

### getDataDirectory

▸ **getDataDirectory**(): `ImageDataDirectoryTable`

#### Returns

`ImageDataDirectoryTable`

#### Defined in

[pe-file-parser.ts:74](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L74)

___

### getDataDirectoryTypes

▸ **getDataDirectoryTypes**(): `string`[]

#### Returns

`string`[]

#### Defined in

[pe-file-parser.ts:86](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L86)

___

### getDialogIncludeResources

▸ **getDialogIncludeResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:370](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L370)

___

### getDialogResources

▸ **getDialogResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:258](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L258)

___

### getDosHeader

▸ **getDosHeader**(): `ImageDosHeader`

#### Returns

`ImageDosHeader`

#### Defined in

[pe-file-parser.ts:62](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L62)

___

### getFileHeader

▸ **getFileHeader**(): `ImageFileHeader`

#### Returns

`ImageFileHeader`

#### Defined in

[pe-file-parser.ts:66](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L66)

___

### getFontDirectoryResources

▸ **getFontDirectoryResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:293](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L293)

___

### getFontResources

▸ **getFontResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:297](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L297)

___

### getGroupCursorResources

▸ **getGroupCursorResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:313](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L313)

___

### getGroupIconResources

▸ **getGroupIconResources**(`languageId?`): `undefined` \| `Record`<`string` \| `number`, `Record`<`string` \| `number`, `GroupIconDirEntry`[]\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `languageId` | `undefined` \| `LanguageId` |

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Record`<`string` \| `number`, `GroupIconDirEntry`[]\>\>

#### Defined in

[pe-file-parser.ts:317](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L317)

___

### getHTMLResources

▸ **getHTMLResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:390](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L390)

___

### getIconResources

▸ **getIconResources**(`languageId?`): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `Icon`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `languageId` | `undefined` \| `LanguageId` |

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `Icon`\>\>\>

#### Defined in

[pe-file-parser.ts:224](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L224)

___

### getImage

▸ **getImage**(): `Optional`<`ImageDos`\>

#### Returns

`Optional`<`ImageDos`\>

#### Defined in

[pe-file-parser.ts:58](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L58)

___

### getImportDirectoryTable

▸ **getImportDirectoryTable**(): `undefined` \| `ImageImportDirectoryTable`

#### Returns

`undefined` \| `ImageImportDirectoryTable`

#### Defined in

[pe-file-parser.ts:90](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L90)

___

### getLanguageIds

▸ **getLanguageIds**(): `LanguageId`[]

#### Returns

`LanguageId`[]

#### Defined in

[pe-file-parser.ts:848](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L848)

___

### getManifestResources

▸ **getManifestResources**(): `undefined` \| `Record`<`string` \| `number`, `Record`<`string` \| `number`, `Manifest`\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Record`<`string` \| `number`, `Manifest`\>\>

#### Defined in

[pe-file-parser.ts:394](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L394)

___

### getMenuResources

▸ **getMenuResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:254](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L254)

___

### getMessageTableResource

▸ **getMessageTableResource**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:309](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L309)

___

### getOptionalHeader

▸ **getOptionalHeader**(): `ImageOptionalHeader`

#### Returns

`ImageOptionalHeader`

#### Defined in

[pe-file-parser.ts:70](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L70)

___

### getPlugAndPlayResources

▸ **getPlugAndPlayResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:374](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L374)

___

### getRCDataResurces

▸ **getRCDataResurces**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:305](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L305)

___

### getResourceDirectoryTable

▸ **getResourceDirectoryTable**(): `undefined` \| `ImageResourceDirectory`

#### Returns

`undefined` \| `ImageResourceDirectory`

#### Defined in

[pe-file-parser.ts:171](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L171)

___

### getResourceTypes

▸ **getResourceTypes**(): `string`[]

#### Returns

`string`[]

#### Defined in

[pe-file-parser.ts:175](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L175)

___

### getResourcesOfType

▸ **getResourcesOfType**<`T`\>(`resourceType`): `undefined` \| `ResourceType`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `RT_RESOURCE_TYPES` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `resourceType` | `string` \| `T` |

#### Returns

`undefined` \| `ResourceType`<`T`\>

#### Defined in

[pe-file-parser.ts:179](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L179)

___

### getSectionHeader

▸ **getSectionHeader**(`sectionId`): `undefined` \| `ImageSectionHeader`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sectionId` | `string` |

#### Returns

`undefined` \| `ImageSectionHeader`

#### Defined in

[pe-file-parser.ts:82](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L82)

___

### getSectionHeaders

▸ **getSectionHeaders**(): `ImageSectionHeader`[]

#### Returns

`ImageSectionHeader`[]

#### Defined in

[pe-file-parser.ts:78](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L78)

___

### getStringTableResources

▸ **getStringTableResources**(`languageId?`): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `string`[]\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `languageId` | `undefined` \| `LanguageId` |

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `string`[]\>\>\>

#### Defined in

[pe-file-parser.ts:262](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L262)

___

### getVersionInfoResources

▸ **getVersionInfoResources**(`languageId?`): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `VsVersionInfo`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `languageId` | `undefined` \| `LanguageId` |

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `VsVersionInfo`\>\>\>

#### Defined in

[pe-file-parser.ts:342](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L342)

___

### getVirtualDeviceResources

▸ **getVirtualDeviceResources**(): `undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Returns

`undefined` \| `Record`<`string` \| `number`, `Partial`<`Record`<`LanguageId`, `any`\>\>\>

#### Defined in

[pe-file-parser.ts:378](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L378)

___

### parseBytes

▸ **parseBytes**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayBuffer` \| `Uint8Array` |

#### Returns

`void`

#### Defined in

[pe-file-parser.ts:48](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L48)

___

### parseFile

▸ **parseFile**(`fd`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fd` | `number` |

#### Returns

`void`

#### Defined in

[pe-file-parser.ts:53](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L53)

___

### setDefaultLanguage

▸ **setDefaultLanguage**(`languageId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `languageId` | `undefined` \| `LanguageId` |

#### Returns

`void`

#### Defined in

[pe-file-parser.ts:44](https://github.com/ryanc16/pe-toolkit/blob/9dcd189/src/pe-file-parser.ts#L44)
