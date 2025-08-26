import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");


    useEffect(() => {
        // Sync theme with <html> class for Tailwind
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            
        } else {
            document.documentElement.classList.remove("dark");

        }
        // Save preference
        localStorage.setItem("theme", theme);
    }, [theme]);

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);


    const fetchUser = async () => {
        setUser(dummyUserData);
    }

    const fetchUserChats = async () => {
        setChats(dummyChats);
        setSelectedChat();
    }

    useEffect(() => {
        fetchUser();
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserChats();
        }
        else {
            setChats([]);
            setSelectedChat(null);
        }
    }, [user])




    const value = {
        navigate, user, setUser, fetchUser,
        chats, setChats, selectedChat,
        setSelectedChat, theme, setTheme
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);

