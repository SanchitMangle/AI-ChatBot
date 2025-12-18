import React, { useEffect, useState } from 'react'
import Loading from '../pages/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Credit = () => {


  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const { axios, token } = useAppContext()

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get('/api/credit/plan', { headers: { AUthorization: token } })
      if (data.success) {
        setPlans(data.plans)
      } else {
        toast.error(data.message || 'Failed to fetch plans')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const purchasePlan = async (planId) => {
    try {
      const { data } = await axios.post('/api/credit/purchase', { planId }, { headers: { AUthorization: token } })
      if (data.success) {
        window.location.href = data.url
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='max-w-6xl w-full h-full overflow-y-auto mx-auto px-6 py-12'>
      <div className='text-center mb-16 mt-8 xl:mt-20'>
        <h2 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-[#3D81F6] bg-clip-text text-transparent mb-4'>Choose Your Plan</h2>
        <p className='text-gray-500 dark:text-gray-400 max-w-lg mx-auto'>Unlock the full potential of QuickGPT with our flexible credit plans designed for every need.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 pb-12'>
        {
          plans.map((plan) => (
            <div key={plan._id} className={`group relative border border-gray-200 dark:border-white/10 rounded-3xl p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 ${plan._id === 'pro' ? 'bg-primary/5 dark:bg-primary/10 ring-2 ring-primary border-transparent' : 'bg-white dark:bg-white/5'}`}>

              {plan._id === 'pro' && <span className='absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-purple-950 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full'>Most Popular</span>}

              <div className='flex-1'>
                <h3 className='text-2xl font-bold mb-4'>{plan.name}</h3>
                <div className='flex items-baseline gap-1 mb-8'>
                  <span className='text-4xl font-bold'>${plan.price}</span>
                  <span className='text-gray-500 dark:text-gray-400'>/ {plan.credits} Credits</span>
                </div>

                <ul className='space-y-4 mb-8'>
                  {
                    plan.features.map((feature, index) => (
                      <li key={index} className='flex items-start gap-3 text-sm opacity-80'>
                        <svg className='w-5 h-5 text-primary shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path></svg>
                        {feature}
                      </li>
                    ))
                  }
                </ul>
              </div>

              <button
                onClick={() => toast.promise(purchasePlan(plan._id), { loading: "Redirecting to checkout..." })}
                className={`w-full py-4 rounded-xl font-bold transition-all cursor-pointer ${plan._id === 'pro' ? 'bg-primary text-purple-950 shadow-lg shadow-primary/20 hover:opacity-90' : 'bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20'}`}>
                Get Started
              </button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Credit
