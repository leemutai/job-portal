import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'

const AddJob = () => {

  const [title, setTitle] = useState('');
  const [location , setLocation] = useState('Nairobi');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState('Beginner');
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
  if (!quillRef.current && editorRef.current) {
    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: 'Write job description...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'clean']
        ]
      }
    })
  }
}, [])




  return (
     <form>
      <div>
        <p>Job Title</p>
        <input type="text" placeholder='Type here'
        onChange={e => setTitle(e.target.value)} value={title} required/>
      </div>

      <div>
        <p>Job Description</p>
        <div ref={editorRef}>

        </div>
      </div>

     </form>
  )
}

export default AddJob