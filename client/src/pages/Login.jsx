import React from 'react'
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

  const { axios, setToken } = useAppContext()

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = state === "login" ? '/api/user/login' : '/api/user/register'

    try {
      const { data } = await axios.post(url, { name, email, password })
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  return (
    <div className="flex flex-col gap-6 m-auto items-center p-8 py-10 w-full max-w-[400px] text-gray-600 dark:text-gray-300 rounded-3xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          {state === "login" ? "Welcome Back" : "Get Started"}
        </h1>
        <p className="text-sm opacity-70">
          {state === "login" ? "Enter your details to access your account" : "Create an account to start using QuickGPT"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {state === "register" && (
          <div className="w-full">
            <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block opacity-60">Full Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="John Doe"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-white/20"
              type="text"
              autoComplete="name"
              required
            />
          </div>
        )}
        <div className="w-full ">
          <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block opacity-60">Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="name@example.com"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-white/20"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="w-full ">
          <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block opacity-60">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="••••••••"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-white/20"
            type="password"
            autoComplete={state === "login" ? "current-password" : "new-password"}
            required
          />
        </div>

        <button type='submit' className="w-full py-3.5 mt-2 bg-primary hover:opacity-90 active:scale-[0.98] text-purple-950 font-bold rounded-xl shadow-lg shadow-primary/20 cursor-pointer transition-all">
          {state === "register" ? "Create Account" : "Sign In"}
        </button>
      </form>

      <div className="text-sm text-center">
        {state === "register" ? (
          <p>
            Already have an account? <span onClick={() => setState("login")} className="text-primary font-semibold cursor-pointer hover:underline underline-offset-4">Sign in</span>
          </p>
        ) : (
          <p>
            Don't have an account? <span onClick={() => setState("register")} className="text-primary font-semibold cursor-pointer hover:underline underline-offset-4">Create one</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default Login
