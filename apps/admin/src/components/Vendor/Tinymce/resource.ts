export const menubar = 'file edit view insert format tools table help'

// almost used all plugins, delete plugins as you want
export const plugins = `preview importcss searchreplace autolink autosave save directionality code 
visualblocks visualchars fullscreen image link media codesample table charmap 
pagebreak nonbreaking anchor insertdatetime advlist lists wordcount 
help charmap quickbars emoticons`

export const templates = [
  {
    title: 'Starting my story',
    description: 'A cure for writers block',
    content: 'Once upon a time...',
  },
  {
    title: 'New list with dates',
    description: 'New List with dates',
    content:
        '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
  },
]

export const toolbar = `undo redo |
bold italic underline strikethrough |
fontselect fontsizeselect formatselect |
alignleft aligncenter alignright alignjustify |
outdent indent |
numlist bullist |
forecolor backcolor removeformat |
pagebreak |
charmap emoticons |
fullscreen preview save print |
insertfile image media link anchor codesample |
ltr rtl`
