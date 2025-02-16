import React from 'react'
import { useThemeStore } from '../store/useThemeStore'
import { THEMES } from '../utils/themes'
import { Send } from 'lucide-react'


export const preview_messages = [
  {
    id: 1,
    content: "Hey! How's it going?",
    isSent: false
  },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true
  },
]

const Settings = () => {

  const { theme, settheme } = useThemeStore()

  return (
    <section className='min-h-screen container mx-auto px-4 pt-20 max-w-5xl'>
      <div className='space-y-6'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-lg font-semibold'>Theme</h2>
          <p className='text-sm text-base-content/70'>Choose a theme for your chat interface</p>
        </div>

        <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2'>
          {THEMES.map((element) =>(
            <button onClick={() =>settheme(element)} key={element} className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${theme === element ? "bg-base-200" : "hover:bg-base-200/50"}`}>
              <div data-theme={element} className='relative h-8 w-full rounded-md overflow-hidden'>
                <div className='absolute inset-0 grid grid-cols-4 gap-px p-1'>
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>

              <span className='text-[11px] font-medium truncate w-full text-center'>
                {element.charAt(0).toUpperCase() + element.slice(1, element.length)}
              </span>
            </button>
          ))}
        </div>

        <h3 className='text-lg font-semibold mb-3'>Preview</h3>
        <div className='rounded-xl border border-base-300 bg-base-100 shadow-lg overflow-hidden'>
          <div className='p-4 bg-base-200'>
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium"> J </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {preview_messages.map((element) => (
                    <div key={element.id} className={`flex ${element.isSent ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl p-3 shadow-sm ${element.isSent ? "bg-primary text-primary-content" : "bg-base-200"}`}>
                        <p className="text-sm">{element.content}</p>
                        <p className={`text-[10px] mt-1.5 ${element.isSent ? "text-primary-content/70" : "text-base-content/70"}`}>12:00 PM</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input type="text" className="input input-bordered flex-1 text-sm h-10" placeholder="Type a message..." value="This is a preview" readOnly />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Settings