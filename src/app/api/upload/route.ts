import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists inside public/
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize filename and append unique timestamp
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueFileName = `${baseName}_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save file locally to the public/uploads directory
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${uniqueFileName}`;

    /* 
    ========================================================================
    CLOUDINARY / FIREBASE CLOUD DEPLOYMENT INTEGRATION (PLUG & PLAY)
    ========================================================================
    If you wish to deploy to Vercel/Netlify where the disk is read-only,
    you can uncomment and configure Cloudinary or Firebase below:

    1. CLOUDINARY UPLOAD:
       import { v2 as cloudinary } from 'cloudinary';
       
       cloudinary.config({
         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
         api_key: process.env.CLOUDINARY_API_KEY,
         api_secret: process.env.CLOUDINARY_API_SECRET
       });

       const uploadResult = await new Promise((resolve, reject) => {
         cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
           if (error) reject(error);
           else resolve(result);
         }).end(buffer);
       });
       
       return NextResponse.json({ url: (uploadResult as any).secure_url });

    2. FIREBASE STORAGE UPLOAD:
       import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
       import { storage } from "@/lib/firebase"; // Your firebase config

       const storageRef = ref(storage, `memories/${uniqueFileName}`);
       await uploadBytes(storageRef, buffer, { contentType: file.type });
       const downloadUrl = await getDownloadURL(storageRef);

       return NextResponse.json({ url: downloadUrl });
    ========================================================================
    */

    return NextResponse.json({ 
      success: true, 
      url: relativeUrl, 
      fileName: uniqueFileName,
      sizeBytes: file.size
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file: " + error.message }, { status: 500 });
  }
}
