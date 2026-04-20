// app/api/upload-properties/route.js
// App Router verzió a tulajdonságok feltöltésére

import { createClient } from '@supabase/supabase-js'
import propertiesData from '../../kyero_properties.json'

// Supabase konfiguráció - környezeti változókból
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key kell a feltöltéshez!
const supabase = createClient(supabaseUrl, supabaseKey)

// Képek letöltése és feltöltése
async function uploadImage(imageUrl, propertyId, imageId) {
  try {
    console.log(`📷 Kép letöltése: ${imageUrl}`)
    
    // Kép letöltése
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const imageBuffer = await response.arrayBuffer()
    
    // Fájl elérési út generálása (property ID alapján rendezve)
    const fileExtension = imageUrl.split('.').pop() || 'jpg'
    const fileName = `property_${propertyId}/image_${imageId}.${fileExtension}`
    
    // Feltöltés Supabase Storage-ba
    const { data, error } = await supabase.storage
      .from('property-images') // bucket neve
      .upload(fileName, imageBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: true // ha már létezik, felülírja
      })
    
    if (error) {
      console.error(`❌ Hiba a kép feltöltésekor ${fileName}:`, error)
      return null
    }
    
    // Publikus URL lekérése
    const { data: publicData } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)
    
    console.log(`✅ Kép feltöltve: ${fileName}`)
    return {
      fileName,
      publicUrl: publicData.publicUrl,
      originalUrl: imageUrl
    }
    
  } catch (error) {
    console.error(`❌ Hiba a kép feldolgozásakor ${imageUrl}:`, error)
    return null
  }
}

// Ingatlan adatok feltöltése
async function uploadProperty(propertyData) {
  try {
    console.log(`\n🏠 Ingatlan feldolgozása: ${propertyData.id}`)
    
    // 1. Képek feltöltése
    const uploadedImages = []
    for (const image of propertyData.images) {
      const uploadResult = await uploadImage(image.url, propertyData.id, image.id)
      if (uploadResult) {
        uploadedImages.push({
          ...uploadResult,
          originalId: image.id,
          isFloorplan: image.floorplan
        })
      }
      // Kis szünet a rate limiting elkerülése érdekében
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    console.log(`📸 ${uploadedImages.length}/${propertyData.images.length} kép feltöltve`)
    
    // 2. Ingatlan alapadatok beszúrása
    const propertyRecord = {
      external_id: propertyData.id,
      reference: propertyData.ref,
      title: `${propertyData.type} in ${propertyData.town}`,
      description: propertyData.description,
      property_type: propertyData.type,
      price: propertyData.price,
      currency: propertyData.currency,
      price_frequency: propertyData.price_freq,
      
      // Lokáció
      country: propertyData.country,
      province: propertyData.province,
      town: propertyData.town,
      location_detail: propertyData.location_detail,
      postal_code: propertyData.postal_code,
      latitude: propertyData.latitude,
      longitude: propertyData.longitude,
      
      // Tulajdonságok
      bedrooms: propertyData.beds,
      bathrooms: propertyData.baths,
      surface_area: propertyData.surface_area,
      has_pool: propertyData.pool === 1,
      new_build: propertyData.new_build === 1,
      part_ownership: propertyData.part_ownership === 1,
      leasehold: propertyData.leasehold === 1,
      
      // Egyéb
      energy_rating: propertyData.energy_rating || null,
      property_age: propertyData.antiguedad,
      property_condition: propertyData.estado_propiedad,
      
      // Ügynökség
      agency_name: propertyData.agencia,
      agency_email: propertyData.email,
      agency_phone: propertyData.telefono,
      
      // URL és dátum
      listing_url: propertyData.url,
      listing_date: propertyData.date,
      
      created_at: new Date().toISOString()
    }
    
    const { data: insertedProperty, error: propertyError } = await supabase
      .from('properties')
      .insert(propertyRecord)
      .select()
      .single()
    
    if (propertyError) {
      console.error('❌ Hiba az ingatlan beszúrásakor:', propertyError)
      return { success: false, error: propertyError }
    }
    
    console.log(`✅ Ingatlan mentve: ID ${insertedProperty.id}`)
    
    // 3. Képek adatainak mentése
    const imageRecords = uploadedImages.map(img => ({
      property_id: insertedProperty.id,
      original_url: img.originalUrl,
      storage_path: img.fileName,
      public_url: img.publicUrl,
      is_floorplan: img.isFloorplan,
      display_order: parseInt(img.originalId)
    }))
    
    if (imageRecords.length > 0) {
      const { error: imagesError } = await supabase
        .from('property_images')
        .insert(imageRecords)
      
      if (imagesError) {
        console.error('❌ Hiba a képek adatainak mentésekor:', imagesError)
      } else {
        console.log(`📸 ${imageRecords.length} kép adata mentve`)
      }
    }
    
    // 4. Jellemzők mentése
    if (propertyData.features && propertyData.features.length > 0) {
      const featureRecords = propertyData.features.map(feature => ({
        property_id: insertedProperty.id,
        feature_name: feature.name
      }))
      
      const { error: featuresError } = await supabase
        .from('property_features')
        .insert(featureRecords)
      
      if (featuresError) {
        console.error('❌ Hiba a jellemzők mentésekor:', featuresError)
      } else {
        console.log(`🏷️ ${featureRecords.length} jellemző mentve`)
      }
    }
    
    return { 
      success: true, 
      propertyId: insertedProperty.id,
      imagesUploaded: uploadedImages.length
    }
    
  } catch (error) {
    console.error(`❌ Hiba az ingatlan feldolgozásakor (${propertyData.id}):`, error)
    return { success: false, error: error.message }
  }
}

// API Handler - App Router verzió
export async function POST(req) {
  try {
    console.log('🚀 Upload Properties API hívás...')
    
    // Request body parse-olása
    const body = await req.json()
    const { batch: batchSize = 5, start: startIndex = 0, end: endIndex = propertiesData.length } = body
    
    console.log(`📊 Feltöltés kezdődik: ${propertiesData.length} ingatlan összesen`)
    console.log(`🎯 Feldolgozás: ${startIndex}-${endIndex} (${endIndex - startIndex} ingatlan)`)
    
    const results = {
      total: endIndex - startIndex,
      processed: 0,
      successful: 0,
      failed: 0,
      errors: []
    }
    
    // Csak egy szelet feldolgozása
    const dataSlice = propertiesData.slice(startIndex, endIndex)
    
    // Batch-ekben dolgozunk
    for (let i = 0; i < dataSlice.length; i += batchSize) {
      const batch = dataSlice.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (property) => {
        try {
          const result = await uploadProperty(property)
          results.processed++
          
          if (result.success) {
            results.successful++
          } else {
            results.failed++
            results.errors.push({
              propertyId: property.id,
              error: result.error
            })
          }
          
          // Progress jelentés
          const progress = Math.round((results.processed / dataSlice.length) * 100)
          console.log(`📊 Haladás: ${results.processed}/${dataSlice.length} (${progress}%)`)
          
          return result
        } catch (error) {
          results.processed++
          results.failed++
          results.errors.push({
            propertyId: property.id,
            error: error.message
          })
          return { success: false, error: error.message }
        }
      })
      
      await Promise.all(batchPromises)
      
      // Szünet batch-ek között
      if (i + batchSize < dataSlice.length) {
        console.log('⏸️ Szünet batch-ek között...')
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    console.log(`🎉 Feltöltés kész! ${results.successful}/${results.total} siker`)
    
    return Response.json({
      message: 'Feltöltés befejezve',
      results
    })
    
  } catch (error) {
    console.error('❌ Upload Properties API hiba:', error)
    return Response.json({ 
      message: 'Szerver hiba',
      error: error.message 
    }, { status: 500 })
  }
}