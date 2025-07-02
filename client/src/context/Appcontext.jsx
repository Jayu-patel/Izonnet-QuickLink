import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AppContext = createContext();

const AppContextProvider = ({children}) => {

  const [token, setToken] = useState(()=> localStorage.getItem("token") || null)
  const [userId, setUserId] = useState(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const storedToken = localStorage.getItem("token");
        return storedToken ? jwtDecode(storedToken)?.id : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (userId) localStorage.setItem("userId", userId);
    else localStorage.removeItem("userId");
  }, [userId]);

  const getDoctorsData = async () => {
    try{
       axios.get(`${import.meta.env.VITE_BACKEND_URL}/doctor/getAllDoctors`)
      .then((res) => {
        if(res?.status === 200){
          setDoctors(res?.data?.doctors || [{ok: false, message: "No doctors found"}]);
          console.log(res.data.doctors)
        }
        else {
          if(res?.response?.data?.message){
            toast.error(res?.response?.data?.message);
          }
        }
      })
      .catch((err) => {
        if(err?.response?.data?.message){
          toast.error(err?.response?.data?.message);
        }
      });
    }
    catch(err) {
      console.error("Error fetching doctors data:", err);
    }
  }

  useEffect(() => {
    getDoctorsData();
  }, []);

  const fetchProfile = useCallback(async (id) => {
    const currentToken = localStorage.getItem("token");

    if (!id || !currentToken) {
      console.warn("fetchProfile blocked: Missing token or id");
      return;
    }
    setIsLoading(true);

    const cachedUser = localStorage.getItem("currentUser");
    if (cachedUser) {
      setUserData(JSON.parse(cachedUser));
      setIsLoading(false);
      return;
    }
    console.log("debug", localStorage.getItem("token"))
    console.log("debug token", token)
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get_user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res?.status === 200) {
        setUserData(res.data);
        localStorage.setItem("currentUser", JSON.stringify(res?.data));
      } 
      else {
        toast.error(res?.data?.message || "Failed to load profile");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error loading profile");
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    if (token && userId) {
      fetchProfile(userId);
    } else {
      setIsLoading(false);
    }
  }, [token, userId, fetchProfile]);

  const reloadProfile = () => {
    if (userId) return fetchProfile(userId);
  };

  const logout = () => {
    setUserData(null);
    setUserId(null);
    setToken(null)
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  // 4. Value for the context
  const value = useMemo(() => ({
    token, setToken,
    doctors,
    userId, setUserId,
    userData,
    getDoctorsData,
    isLoading,
    reloadProfile,
    logout,
  }), [token, userId, userData, isLoading, doctors]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
