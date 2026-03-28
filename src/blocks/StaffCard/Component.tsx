'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import RichText from '@/components/RichText'

import type { StaffCardBlock as StaffCardBlockProps } from '@/payload-types'

export const StaffCardBlock: React.FC<StaffCardBlockProps> = (props) => {
  const { staffMembers } = props
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)

  if (!staffMembers || staffMembers.length === 0) {
    return null
  }

  return (
    <div className="container my-16">
      <div className="flex flex-wrap gap-8 justify-center">
        {staffMembers.map((staff) => {
          if (typeof staff === 'string') return null

          const isSelected = selectedStaff === staff.id
          const headshotUrl = staff.headshot && typeof staff.headshot === 'object' 
            ? (staff.headshot as any).url
            : null

          return (
            <div
              key={staff.id}
              className="flex flex-col select-none shadow-xl rounded-md overflow-hidden max-w-96 mx-2"
            >
              {isSelected ? (
                // Bio View
                <div className="bg-slate-800 px-4 py-6 min-h-96 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl text-slate-300 font-bold mb-4">{staff.name}</h3>
                    <div className="text-slate-400 text-sm mb-6">
                      {staff.bio && <RichText data={staff.bio} enableGutter={false} />}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStaff(null)}
                    className="transition duration-300 px-4 py-2 border-sky-500 border-2 rounded-sm text-sky-500 font-bold hover:text-white hover:bg-sky-500 mx-auto w-fit"
                  >
                    Back
                  </button>
                </div>
              ) : (
                <>
                  {/* Profile View */}
                  <div className="bg-slate-800 px-4 py-2 pb-6">
                    {headshotUrl && (
                      <Image
                        src={headshotUrl}
                        alt={`${staff.name} profile image`}
                        width={176}
                        height={176}
                        className="w-44 h-44 rounded-full p-2 border-sky-500 border-2 mx-auto mb-2 object-cover"
                      />
                    )}
                    <div className="text-center mb-6">
                      <p className="text-2xl text-slate-300 font-bold">{staff.name}</p>
                    </div>
                    <div className="mx-auto w-fit">
                      <button
                        onClick={() => setSelectedStaff(staff.id)}
                        className="transition duration-300 px-4 py-2 border-sky-500 border-2 rounded-sm text-white font-bold bg-sky-500 hover:bg-sky-600"
                      >
                        Bio
                      </button>
                    </div>
                  </div>
                  {/* Skills Section */}
                  {staff.skills && staff.skills.length > 0 && (
                    <div className="bg-slate-900 space-y-2 p-4">
                      <p className="uppercase font-bold text-slate-500 text-sm">skills</p>
                      <div className="flex flex-wrap gap-2">
                        {staff.skills.map((skillObj, idx) => {
                          const skill = typeof skillObj === 'object' ? skillObj.skill : skillObj
                          return (
                            <div
                              key={idx}
                              className="transition duration-300 px-2 py-1 text-white font-bold bg-sky-400 hover:bg-sky-500 cursor-pointer rounded-sm text-xs"
                            >
                              {skill}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
