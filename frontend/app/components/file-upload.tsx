import React from "react";
import {Upload} from "lucide-react"
const FileUploadComponent: React.FC = () => {

    const handlePdfFileUploadButtonClick = () => {
        const el = document.createElement("input");
        el.setAttribute("type" , "file");
        el.setAttribute("accept" ,".pdf" );
        el.addEventListener('change',async (e) => {
            if(el.files && el.files.length > 0) {
                const file = el.files.item(0);
                if(file) {
                    const formData = new FormData();
                    formData.append("pdf", file);

                   await fetch("http://localhost:8080/upload/pdf" ,{
                        method  : "POST",
                        body : formData,
                    })
                    console.log("File uploaded")
                }
                
            }
        })
        el.click();
    }
    return (
        <div className="bg-slate-900 text-white shadow-2xl p-4 flex items-center justify-center w-[20vw] border-2 border-white rounded-xl">
          <div
          onClick={handlePdfFileUploadButtonClick} 
          className=" flex flex-col justify-center items-center text-lg gap-4">
          <h3>Upload pdf file</h3>
           <Upload />
           </div>
        </div>
    )
}

export default FileUploadComponent;