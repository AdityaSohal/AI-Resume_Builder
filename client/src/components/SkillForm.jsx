import React, { useState } from 'react'

const SkillForm = (data, onChange ) => {
    const[newSkill , setNewSkill] = useState("")
    const addSkill = ()=>{
        if(newSkill.trim() && !data.includes(newSkill.trim())){
            onChange([...data,newSkill.trim()])
            setNewSkill("")
        }
    }
    const removeSkill = (indexToRemove)=>{
        onChange(data.filter((_,index)=>index!=indexToRemove))
    }
    const handleKeyPress= (e)=>{
        if(e.key === "Enter"){
            e.preventDefault();
            addSkill();
        }
    }
  return (
    <div>SkillForm</div>
  )
}

export default SkillForm