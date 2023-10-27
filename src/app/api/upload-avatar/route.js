import { connectToDB } from '@/utils/database'
import User from '@/models/user'
import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'your-region' // e.g., 'us-west-2'
})

const s3 = new AWS.S3()

// Multer setup for S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname) // unique filename
    }
  })
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req, res) {
  try {
    await connectToDB()

    upload.single('avatar')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Upload to S3 failed' })
      }

      const userId = req.body.userId // Again, this ideally comes from JWT or session
      const user = await User.findById(userId)

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      user.profileImage = req.file.location // URL provided by S3

      await user.save()

      res.status(200).json({
        success: true,
        message: 'Avatar uploaded to S3 successfully',
        avatarURL: req.file.location,
      })
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Failed to upload avatar' })
  }
}
