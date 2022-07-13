import {useState,useEffect} from 'react'
import swal from 'sweetalert';


const Base_url = (process.env.REACT_APP_BASE_URL as string);

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

    console.log(data);

    return data;

    } catch (error) {
        swal("Error fetching employees","","error");
    }
}

const Employees = ()=>{

    const [employees,setEmployees]= useState<employeeInterface>();
    const [currentEmployees,setCurrentEmployees]=useState<employeeInterface>();
    const [selected,setSelected]=useState<employeeInterface>();

    const [search,setSearch]=useState<string>('');

    const loadEmployees = async()=>{
       let data= await getData();

       setEmployees(data);
       setCurrentEmployees(data);
    }

    useEffect(()=>{
        let abortController = new AbortController(); 

        loadEmployees().then();

        return()=>{
            abortController.abort();
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

    const handleClick=(e:React.MouseEvent<HTMLLIElement>)=>{
        e.preventDefault();
        let element=e.currentTarget.getAttribute('id');

        let picked = currentEmployees?.find((emp:employeeInterface)=>emp.id==element)

        setSelected(picked);
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
               {selected && <div className="employee  card">
                    <div className="field">
                        <label htmlFor="fname">Name</label>
                        <span id="fname">{selected?.firstName} {selected?.lastName}</span>
                    </div>
                    <div className="field">
                        <label htmlFor="phone">Phone</label>
                        <span id="phone">{selected?.phone}</span>
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <span id="email">{selected?.email}</span>
                    </div>
                    <div className="field">
                        <label htmlFor="address">Address</label>
                        <span id="address">{selected?.address}</span>
                    </div>
                    <div className="field">
                        <label htmlFor="dob">Date of Birth</label>
                        <span id="dob">{selected?.data_of_birth}</span>
                    </div>
                </div>
}

            </div>
           
        
        
        </div>
    )
}

export default Employees