import { RichTextAdapter } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const defaultLexical: RichTextAdapter = lexicalEditor({
  nodes: ['block', 'relationship', 'upload'],
})
