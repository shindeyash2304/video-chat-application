"use client";

import {FileIcon, X} from 'lucide-react'
import Image from 'next/image';

import { UploadDropzone } from "@/utils/uploadthing";

import "@uploadthing/react/styles.css"

interface FileUploadProps {
  endpoint: "messageFile" | "serverImage";
  onChange: (url?: string) => void;
  value: string;
}


const FileUpload = (props: FileUploadProps) => {
  // console.log(props.value);
  
  const fileType=props.value?.split(".").pop()

  if(props.value && fileType!=='pdf')
  {
    return (<div className='relative h-20 w-20 justify-center'>
      <Image src={props.value} fill alt='Uploaded Image' className=' rounded-full'/>
      <button onClick={()=>props.onChange("")} className='bg-rose-500 text-right p-1 rounded-full absolute top-0 right-0 shadow-sm' type='button'>
        <X className=' h-4 w-4'/>
      </button>
    </div>
    )
  }
  if(props.value && fileType==='pdf')
  {
    return (
      <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
      <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400'/>
      <a href={props.value} target="_blank" rel="noopener noreffer" className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'>{props.value}</a>
      <button onClick={()=>props.onChange("")} className='bg-rose-500 text-right p-1 rounded-full absolute -top-2 -right-0 shadow-sm' type='button'>
        <X className=' h-4 w-4'/>
      </button>
    </div>
      )
  }
  return (
    <div>
      <UploadDropzone endpoint={props.endpoint} onClientUploadComplete={(res)=>{
        props.onChange(res?.[0].url)
      }} onUploadError={(error: Error)=>{
        console.log(error);
        
      }}/>
    </div>
  )
}

export default FileUpload