import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmationPopup from "../../components/Pop-up";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setloading] = useState(false)

  const [showPopup, setShowPopup] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const fetchMessages = async () => {
    try {
        setloading(true)
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-messages?page=${page}&limit=10`, {headers: {Authorization: `Bearer ${localStorage.getItem('adminToken')}`}})
        .then(res=>{
            setMessages(res.data.messages);
            setTotalPages(res.data.totalPages);
        })
        .catch((err)=>{
            if(err?.response?.data?.message){
            toast.error(err?.response?.data?.message);
            }
        })
        .finally(()=>{setloading(false)})
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(search.toLowerCase()) ||
    msg.email.toLowerCase().includes(search.toLowerCase()) ||
    msg.message.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit=(id)=>{
    setSelectedId(id)
    setShowPopup(true)
  }
  const handleConfirm=()=>{
    //function
    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/remove-message/${selectedId}`, {headers: {Authorization: `Bearer ${localStorage.getItem('adminToken')}`}})
    .then(res=>{
      toast.success(res.data.message)
    })
    .catch((err)=>{
        if(err?.response?.data?.message){
        toast.error(err?.response?.data?.message);
        }
    })
    .finally(()=>{
      fetchMessages()
    })
    setShowPopup(false)
  }
  const handleCancel=()=> setShowPopup(false)
  if(messages.length == 0 && loading) return <div className='w-[100%] h-[calc(100vh-100px)] grid place-items-center'> <Loader/> </div>
  return (
    <div className="p-6 w-[80%] mx-auto">
      <ConfirmationPopup
        showPopup={showPopup}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
          header={"Remove Message"}
          message={"Are you sure you want to remove this message?"}
          btnMessage={"Remove"}
      />
      <h2 className="mb-3 md:text-2xl text-xl font-semibold">Messages</h2>

      <input
        type="text"
        placeholder="Search..."
        className="w-full mb-4 p-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-auto shadow rounded-lg">
        <div className='grid grid-cols-[2fr_3fr_3fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>Name</p>
          <p>Email</p>
          <p>Date</p>
          <p>Actions</p>
        </div>
        {
          filteredMessages?.map((msg,index)=>(
            <div key={index} className="grid grid-cols-[2fr_3fr_3fr_1fr] grid-flow-col py-3 px-6 border-b last:border-b-0 even:bg-gray-100">
              <p>{msg.name}</p>
              <p>{msg.email}</p>
              <p>{new Date(msg.createdAt).toLocaleString()}</p>
              <div>
                <button
                    onClick={() => setSelectedMessage(msg)}
                    className="bg-[#5f6fff] text-white px-2 py-1 rounded cursor-pointer"
                  >
                    View
                </button>
                <button
                    onClick={() => {handleSubmit(msg._id)}}
                    className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer ml-2"
                  >
                    Delete
                </button>
              </div>
            </div>
          ))
        }
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2 [&_button]:cursor-pointer">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-2">Message from {selectedMessage.name}</h3>

            <p className="text-gray-700 mb-4 break-words">{selectedMessage.message}</p>

            <div className="w-full flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
                onClick={() => setSelectedMessage(null)}
              >Close</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}