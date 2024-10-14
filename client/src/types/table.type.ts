import { eRowEditMode } from './enums';
import { SelectOption } from './metadata.type';

type Padding = 'normal' | 'checkbox' | 'none';

export interface ColumnDef<TRowModel> {
  align?: 'left' | 'right' | 'center';
  field?: keyof TRowModel; // Ensure it's a key of TRowModel
  formatter?: (row: TRowModel, index: number, disabledEdit?: boolean) => React.ReactNode;
  valueForEdit?: (row: TRowModel) => any;
  valueOption?: any & { id: string }[];
  editInputType?: string;
  hideName?: boolean;
  name: string;
  width?: number | string;
  padding?: Padding;
  tooltip?: string;
  selectOptions?: SelectOption<string>[];
  editable?: boolean;
}

export interface RowProps {
  editMode: eRowEditMode;
  sx: React.CSSProperties;
  deleteIcon?: JSX.Element;
}
