import React, {useState,useEffect} from 'react'
import swal from 'sweetalert';


let Base_url = (process.env.REACT_APP_BASE_URL as string);

if(!Base_url){
    Base_url = "http://localhost:5500/";
}

interface employeeInterface {
    map: any;
    filter:any
    find:any
    id:string
    firstName:string
    lastName:string
    address:string
    phone:string
    email:string
    data_of_birth:string
}

const getData = async()=>{
    try {
       let response =await fetch(Base_url,{
        method:'GET',
        headers:{'Content-Type':'application/json'}
    });

    if(!response.ok){
        let err =await response.json();

        throw {status:err.status,message:err.message}
    }

    let data:employeeInterface = await response.json();

    // console.log(data);

    return data;

    } catch (error) {
        swal("Error fetching employees","","error");
    }
}

const Employees = ()=>{

    const [employees,setEmployees]= useState<employeeInterface>();
    const [currentEmployees,setCurrentEmployees]=useState<employeeInterface>();
    const [selected,setSelected]=useState<string>();

    const [firstName,setFirstName]=useState<string>()
    const [lastName,setLastName]=useState<string>()
    const [phone,setPhone]=useState<string>()
    const [address,setAddress]=useState<string>()
    const [email,setEmail]=useState<string>()
    const [dob,setDOB]=useState<string>()

    const [editBtn,setEditBtn]=useState<string>('Edit')
    const [deleteBtn,setDeleteBtn]=useState<string>('Delete')






    const [search,setSearch]=useState<string>('');

    const loadEmployees = async()=>{
       let data= await getData();

       setEmployees(data);
       setCurrentEmployees(data);
    }

    useEffect(()=>{
        let abortController = new AbortController(); 

        loadEmployees().then();
        let interval = setInterval(loadEmployees,10000);

        return()=>{
            abortController.abort();
            clearInterval(interval);
        }

    },[])

    useEffect(()=>{
        let searchResult = employees?.filter((record:employeeInterface)=>{
            return record.id.includes(search)||record.firstName.includes(search)||record.lastName.includes(search)||record.address.includes(search)||record.phone.includes(search)||record.email.includes(search)||record.data_of_birth.includes(search)
        })

        console.log(searchResult);

        setCurrentEmployees(searchResult);

        console.log(currentEmployees);

    },[search])
    
        const handleDelete = async(e:React.MouseEvent)=>{
            e.preventDefault();
            try{
                let response = await fetch(Base_url,{
                    method:'DELETE',
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify({id:selected})
                })
    
                if(!response.ok){
                    throw new Error("Error delete employee")
                }
    
                if(response){
                    swal("Great","Record delete successfully","success");
                    setSelected('');
                    loadEmployees();
                }
            }
            catch(err){
                swal("Employee","Something went wrong","error")
            }
        }
    
        const handleEdit = async(e:React.MouseEvent)=>{
            e.preventDefault();
            try{
                setEditBtn('Loading...');

                let response = await fetch(Base_url,{
                    method:'PUT',
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify({
                        id:selected,
                        firstName:firstName,
                        lastName:lastName,
                        address:address,
                        phone:phone,
                        email:email,
                        date_of_birth:dob
                    })

                })
    
                if(!response.ok){
                    throw new Error("Error edit employee")
                }
    
                if(response){
                    let data = await response.json();
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setPhone(data.phone);
                    setAddress(data.address);
                    setDOB(data.data_of_birth);
                    setEmail(data.email);


                    loadEmployees();
                    
                    setEditBtn('Done!');
                    setTimeout(()=>{
                    setEditBtn('Edit');
                    },2000)
                }
               
            }
            catch(err){
                swal("Employee","Something went wrong","error")
            }
        }


   

    const handleClick=(e:React.MouseEvent<HTMLLIElement>)=>{
        e.preventDefault();
        let element=e.currentTarget.getAttribute('id');
        let picked = currentEmployees?.find((emp:employeeInterface)=>emp.id===element);

        setSelected(picked.id);

        setFirstName(picked?.firstName);
        setLastName(picked?.lastName);
        setPhone(picked?.phone);
        setAddress(picked?.address);
        setEmail(picked?.email);
        setDOB(picked?.data_of_birth);
        } 
        


    return(
        <div className='row'>
            <div className='container card' style={{width:`inherit`}}>

            <div className="input_field">
                 <label>Search</label>
            <div>
              <input
               value={search}
               type="text" 
               onChange={(e)=>setSearch(e.target.value)} 
               placeholder="Type to Search"
               />
            </div>
                <ul>
                {currentEmployees && currentEmployees.map((em:employeeInterface)=>{
                    return(
                        <li key={em.id} id={em.id} onClick={(e)=>handleClick(e)} >
                            <span className='title'>{em.id} {em.firstName} {em.lastName}</span>
                            {/* <button onClick={() => console.log('work work')}>Pro matches</button> */}
                        </li>
                    )
                })}
            </ul> 
            </div>
            </div>
            <div className='container'  style={{width:"inherit", marginRight:"35px"}}>
               {selected && <form className="employee  card">
                    <div className="field">
                        <label htmlFor="fname">Name</label>
                        <input type="text" placeholder="Enter first name" value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                        <input type="text" placeholder="Enter last name" value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                    </div>
                    <div className="field">
                        <label htmlFor="phone">Phone</label>
                        <input type="text" placeholder="Enter phone number" value={phone} onChange={(e)=>setPhone(e.target.value)}/>
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder="Enter Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    <div className="field">
                        <label htmlFor="address">Address</label>
                        <input type="text" placeholder="Enter address" value={address} onChange={(e)=>setAddress(e.target.value)}/>
                    </div>
                    <div className="field">
                        <label htmlFor="dob">Date of Birth</label>
                        <input type="text" placeholder="Set Date of birth" value={dob}/>
                        <input type="date" onChange={(e)=>setDOB(e.target.value)} style={{width:"35px"}}/>
                    </div>
                    <div className="field">
                        <button style={{backgroundColor:"rgba(9, 101, 177, 0.966)"}} onClick={(e)=>handleEdit(e)}>{editBtn}</button>
                        <button style={{backgroundColor:"orange"}} onClick={(e)=>handleDelete(e)}>{deleteBtn}</button>
                    </div>
                </form>
}

            </div>
           
        
        
        </div>
    )
}

export default Employees