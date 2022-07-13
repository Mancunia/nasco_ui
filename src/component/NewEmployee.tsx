import { useState,useEffect } from "react"
import swal from "sweetalert";
const Base_url = (process.env.REACT_APP_BASE_URL as string);

const NewEmployee = ()=>{

    const [firstName,setFirstName]= useState<string>();
    const [lastName,setLastName]= useState<string>();
    const [phone,setPhone]= useState<string>();
    const [address,setAddress]= useState<string>();
    const [dob,setDOB]= useState<string>();
    const [email,setEmail]= useState<string>()


    const handleSubmit = async(e: { preventDefault: () => void })=>{
        e.preventDefault()
      try{
        if(firstName==null||lastName==null||address==null||phone==null||email==null||dob==null){
            throw new Error('All fields are required')
        }
        let response = await fetch(Base_url,{
            method:'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                firstName:firstName,
                lastName:lastName,
                address:address,
                phone:phone,
                email:email,
                date_of_birth:dob
            })
        })

        if(!response.ok){
            throw new Error("Error add employee")
        }

        if(response){
            swal("Great","Record add successfully","success");
            setFirstName('');
            setLastName('');
            setPhone('');
            setAddress('');
            setDOB('');
            setEmail('');
        }
    }
    catch(err){
        swal("Employee","Something went wrong","error")
    }

    }

    return(
        <div className="card" style={{padding:"5%"}}>
            <h3>Add an Employee</h3>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="container">
                         <div className="input_field">
                        <label htmlFor="fname">First Name</label>
                        <input type="text" value={firstName} onChange={(e)=>setFirstName(e.target.value)} required id="fname" />
                    </div>
                    </div>
                    <div className="container">
                    <div className="input_field">
                        <label htmlFor="phone">Last Name</label>
                        <input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)} required id="lname" />
                    </div>
                    </div>
                </div>
           
                    <div className="input_field">
                        <label htmlFor="phone">Phone</label>
                        <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} required id="fname" />
                    </div>
                    <div className="input_field">
                        <label htmlFor="email">Email</label>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required id="fname" />
                    </div>
                    <div className="input_field">
                        <label htmlFor="address">Address</label>
                        <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)}  required id="fname" />
                    </div>
                    <div className="input_field">
                        <label htmlFor="dob">Date of Birth</label>
                        <input type="date" value={dob} onChange={(e)=>setDOB(e.target.value)} required id="fname" />
                    </div>
                    <div className="input_field">
                        <button>Submit</button>
                    </div>
            </form>

        </div>
    )

}

export default NewEmployee