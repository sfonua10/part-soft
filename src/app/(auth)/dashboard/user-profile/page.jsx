'use client'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { fetcher } from '@/utils/fetcher'

export default function UserProfile() {
  const [editedUser, setEditedUser] = useState({})
  const [avatarFile, setAvatarFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  const { data: session } = useSession()

  const userId = session?.user?.id
  const shouldFetch = !!userId
  const { data: user, error } = useSWR(
    shouldFetch ? `/api/user-info?userId=${userId}` : null,
    fetcher,
  )

  if (error) return <div>Error loading user data</div>
  if (!user) return <div>Loading...</div>

  const handleFieldChange = (field, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAvatarPreview = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()

      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }

      reader.readAsDataURL(file)
      setAvatarFile(file)
    }
  }

  const handleSave = async () => {
    // if (avatarFile) {
    //   setUploading(true)
    //   const formData = new FormData()
    //   formData.append('avatar', avatarFile)

    //   try {
    //     const response = await fetch('/api/upload-avatar', {
    //       method: 'POST',
    //       body: formData,
    //     })

    //     const data = await response.json()

    //     if (data.success && data.url) {
    //       handleFieldChange('image', data.url)
    //     } else {
    //       console.error('Failed to upload image:', data.message)
    //     }
    //   } catch (error) {
    //     console.error('Error uploading avatar:', error)
    //   } finally {
    //     setUploading(false)
    //   }
    // }

    try {
      const userData = {
        ...editedUser,
        _id: userId,
      }

      const response = await fetch('/api/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const responseData = await response.json()

      if (responseData.success) {
        console.log('User updated successfully!')
      } else {
        console.error('Error updating user:', responseData.message)
      }
    } catch (error) {
      console.error('There was an error updating the user:', error)
    }
  }
  return (
    <main>
      <div className="divide-y divide-white/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              {/* Use a permanent address where you can receive mail. */}
              Name and Email address
            </p>
          </div>

          <form className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full flex items-center gap-x-8">
                {/* <img
                  src={
                    previewImage ||
                    user.image ||
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                  }
                  alt=""
                  className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                /> */}
                <div>
                  {uploading ? (
                    <p>Uploading...</p>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarPreview}
                        ref={(input) =>
                          input &&
                          input.addEventListener('click', (e) =>
                            e.stopPropagation(),
                          )
                        }
                        id="avatarInput"
                      />
                      {/* <button
                        type="button"
                        disabled
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() =>
                          document.getElementById('avatarInput').click()
                        }
                      >
                        Change avatar
                      </button> */}
                    </>
                  )}
                  {/* <p className="mt-2 text-xs leading-5 text-gray-400">
                    JPG, GIF or PNG. 1MB max.
                  </p> */}
                </div>
              </div>

              {/* <div className="col-span-full flex items-center gap-x-8">
                <img
                  src={
                    user.image ||
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                  }
                  alt=""
                  className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                />
                <div>
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change avatar
                  </button>
                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div> */}

              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    value={editedUser.name || user.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    readOnly
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={editedUser.email || user.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="block w-full rounded-md border-0 bg-gray-100 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <button
                type="submit"
                onClick={handleSave}
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Save
              </button>
            </div>
          </form>
        </div>
        {/* 
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Delete account
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              No longer want to use our service? You can delete your account
              here. This action is not reversible. All information related to
              this account will be deleted permanently.
            </p>
          </div>

          <form className="flex items-start md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-red-400"
            >
              Yes, delete my account
            </button>
          </form>
        </div> */}
      </div>
    </main>
  )
}
