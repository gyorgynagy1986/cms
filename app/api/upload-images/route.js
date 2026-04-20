// app/api/upload-images/route.js
// API endpoint képek feltöltéséhez

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req) {
  try {
    const formData = await req.formData()
    const propertyId = formData.get('propertyId')
    
    if (!propertyId) {
      throw new Error('Property ID hiányzik')
    }

    const uploadedImages = []
    const files = formData.getAll('images')

    console.log(`📸 ${files.length} kép feltöltése property ${propertyId}-hoz`)

    // Képek egyenként feltöltése
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        // Fájl név és út generálása
        const fileExtension = file.name.split('.').pop()
        const fileName = `property_${propertyId}/image_${i + 1}_${Date.now()}.${fileExtension}`
        
        // Fájl tartalmának kiolvasása
        const fileBuffer = await file.arrayBuffer()
        
        // Feltöltés Supabase Storage-ba
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, fileBuffer, {
            contentType: file.type,
            upsert: false
          })
        
        if (uploadError) {
          console.error(`Kép feltöltési hiba (${file.name}):`, uploadError)
          continue
        }
        
        // Publikus URL generálása
        const { data: publicData } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName)
        
        uploadedImages.push({
          storage_path: fileName,
          public_url: publicData.publicUrl,
          display_order: i + 1,
          original_name: file.name
        })
        
        console.log(`✅ Kép feltöltve: ${fileName}`)
        
      } catch (error) {
        console.error(`Hiba a kép feldolgozásakor (${file.name}):`, error)
      }
    }

    // Képek adatainak mentése az adatbázisba
    if (uploadedImages.length > 0) {
      const imageRecords = uploadedImages.map(img => ({
        property_id: parseInt(propertyId),
        storage_path: img.storage_path,
        public_url: img.public_url,
        is_floorplan: false,
        display_order: img.display_order
      }))

      const { error: imagesError } = await supabase
        .from('property_images')
        .insert(imageRecords)

      if (imagesError) {
        console.error('Képek adatainak mentési hiba:', imagesError)
        throw new Error('Képek adatainak mentési hiba')
      }

      console.log(`📸 ${imageRecords.length} kép adata mentve az adatbázisba`)
    }

    return Response.json({
      success: true,
      uploadedCount: uploadedImages.length,
      images: uploadedImages,
      message: `${uploadedImages.length} kép sikeresen feltöltve`
    })

  } catch (error) {
    console.error('❌ Képfeltöltési API hiba:', error)
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}