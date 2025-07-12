// src/components/ui/RichTextEditor.tsx
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

type Props = {
  onChange: (html: string) => void;
  initialValue?: string;
};

export default function RichTextEditor({ onChange, initialValue }: Props) {
  return (
    <SunEditor
      defaultValue={initialValue}
      onChange={(content) => onChange(content)}
      setOptions={{
        height: 'auto',
        minHeight: '150px',
        buttonList: [
          ['bold', 'italic', 'underline'],
          ['fontColor', 'hiliteColor'],
          ['list', 'align'],
          ['undo', 'redo'],
        ],
      }}
    />
  );
}
