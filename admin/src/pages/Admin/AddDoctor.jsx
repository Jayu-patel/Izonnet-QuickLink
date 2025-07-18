import axios from 'axios';
import { useState, useContext } from 'react'
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

export default function AddDoctor() {

  const {specialities} = useContext(AppContext)
  const [docImage, setDocImage] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [education, setEducation] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);

  const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit= async() => {
    const formData = new FormData();
    setLoading(true);

    if(docImage) formData.append('image', docImage);
    else {
      setLoading(false);
      return toast.error("Please upload doctor's image");
    }

    if(!name) {setLoading(false); return toast.error("Please enter doctor's name");}
    else formData.append('name', name);

    if(!email) {setLoading(false); return toast.error("Please enter doctor's email");}
    else if(!(regex.test(email))) {setLoading(false); return toast.error("Please enter a valid email");}
    else formData.append('email', email);

    if(!password) {setLoading(false); return toast.error("Please enter doctor's password");}
    if(password.includes(' ')) {setLoading(false); return toast.error("Password cannot contain spaces");}
    else if(password.length < 6) {setLoading(false); return toast.error("Password must be at least 6 characters long");}
    else formData.append('password', password);

    if(!experience) {setLoading(false); return toast.error("Please select doctor's experience");}
    else formData.append('experience', experience);

    if(!fees) {setLoading(false); return toast.error("Please enter doctor's fees");}
    else if(fees < 0) {setLoading(false); return toast.error("Fees cannot be negative");}
    else formData.append('fees', fees);

    if(!speciality) {setLoading(false); return toast.error("Please select doctor's speciality");}
    else formData.append('speciality', speciality);

    if(!education) {setLoading(false); return toast.error("Please enter doctor's education");}
    else formData.append('degree', education);

    if(!address1 || !address2) {setLoading(false); return toast.error("Please enter doctor's address");}
    else formData.append('address', JSON.stringify({
      line1: address1,
      line2: address2
    }));

    if(!about) {setLoading(false); return toast.error("Please write about the doctor");}
    else formData.append('about', about);

    try{
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/addDoctor`, formData, {headers: {Authorization: `Bearer ${localStorage.getItem('adminToken')}`}})
      .then(res=>{
        if(res.status !== 200){
          if(res?.response?.data?.message){
            toast.error(res?.response?.data?.message);
          }
        }
        else{
          toast.success("Doctor added successfully");
          setDocImage(false);
          setName('');
          setEmail('');
          setPassword('');
          setExperience('1 Year');
          setFees('');
          setSpeciality('General physician');
          setEducation('');
          setAddress1('');
          setAddress2('');
          setAbout('');
        }
        setLoading(false);
      })
      .catch(err => {
        if(err?.response?.data?.message){
          toast.error(err?.response?.data?.message);
        }
        setLoading(false);
      });
    }
    catch (error) {
      console.error(error);
      return toast.error("Failed to add doctor. Please try again.");
    }
  }

  return (
    <div className='m-5 w-full'>
      <p className='mb-3 md:text-2xl text-xl font-semibold'>Add Doctor</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="image">
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImage ? URL.createObjectURL(docImage) : `/upload_area.svg`} alt="" />
          </label>
          <input onChange={(e)=>{setDocImage(e.target.files[0])}} type="file" id="image" hidden />
          <p>Upload doctor <br/> picture</p>
        </div>

        <div className='flex flex-col lg:flex-row gap-10 items-start text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Name</p>
              <input value={name} onChange={(e)=>{setName(e.target.value)}} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input value={email} onChange={(e)=>{setEmail(e.target.value)}} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Password</p>
              <input value={password} onChange={(e)=>{setPassword(e.target.value)}} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select value={experience} onChange={(e)=>{setExperience(e.target.value)}} className='border rounded px-3 py-2' name="experience">
                {
                  [1,2,3,4,5,6,7,8,9,10].map(e=> <option key={e} value={e}>{e} Year</option>)
                }
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input value={fees} onChange={(e)=>{setFees(e.target.value)}} className='border rounded px-3 py-2' type="number" placeholder='Fees' required />
            </div>

          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select value={speciality} onChange={(e)=>{setSpeciality(e.target.value)}} className='border rounded px-3 py-2' name="" id="">
                {
                  specialities?.map((element,i)=>{
                    return <option key={i} value={element.speciality}>{element.speciality}</option>
                  })
                }
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input value={education} onChange={(e)=>{setEducation(e.target.value)}} className='border rounded px-3 py-2' type="text" placeholder='Education' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input value={address1} onChange={(e)=>{setAddress1(e.target.value)}} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
              <input value={address2} onChange={(e)=>{setAddress2(e.target.value)}} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
            </div>

          </div>
        </div>

        <div>
          <p className='mt-4 mb-4'>About Doctor</p>
          <textarea value={about} onChange={(e)=>{setAbout(e.target.value)}} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='Write about doctor' required />
        </div>

        {
          loading 
          ? <button disabled className='bg-[#7882d6] px-10 py-3 mt-4 text-white rounded-full cursor-pointer'>Loading...</button>
          :<button onClick={()=>{handleSubmit()}} className='bg-[#5f6fff] px-10 py-3 mt-4 text-white rounded-full cursor-pointer'>Add Doctor</button>
        }

      </div>
    </div>
  )
}
