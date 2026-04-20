// app/api/upload-apartment/route.js
// API endpoint apartman feltöltéshez

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Szerver oldalon elérhető!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req) {
  try {
    const body = await req.json()
    const { propertyData, features } = body

    console.log('🏠 Apartman feltöltés API...')

    // 1. Apartman alapadatok mentése
    const propertyRecord = {
      external_id: `MANUAL_${Date.now()}`, // ← Egyedi ID generálás
      title: propertyData.title?.trim(),
      description: propertyData.description?.trim(),
      price: parseFloat(propertyData.price) || 0,
      currency: propertyData.currency || 'EUR',
      
      country: propertyData.country || 'Hungary',
      province: propertyData.province?.trim(),
      town: propertyData.town?.trim(),
      postal_code: propertyData.postal_code?.trim(),
      
      bedrooms: parseInt(propertyData.bedrooms) || null,
      bathrooms: parseInt(propertyData.bathrooms) || null,
      surface_area: parseInt(propertyData.surface_area) || null,
      
      property_type: propertyData.property_type || 'Apartment',
      has_pool: propertyData.has_pool || false,
      
      // Csak a létező oszlopokat tartjuk meg:
      agency_name: propertyData.agency_name?.trim() || null,
      agency_email: propertyData.agency_email?.trim() || null,
      agency_phone: propertyData.agency_phone?.trim() || null,
      
      created_at: new Date().toISOString()
    }

    const { data: insertedProperty, error: propertyError } = await supabase
      .from('properties')
      .insert(propertyRecord)
      .select()
      .single()

    if (propertyError) {
      throw new Error(`Apartman mentési hiba: ${propertyError.message}`)
    }

    console.log(`✅ Apartman mentve: ID ${insertedProperty.id}`)

    // 2. Jellemzők mentése (ha vannak)
    if (features && features.length > 0) {
      const featureRecords = features.map(featureName => ({
        property_id: insertedProperty.id,
        feature_name: featureName.trim()
      }))

      const { error: featuresError } = await supabase
        .from('property_features')
        .insert(featureRecords)

      if (featuresError) {
        console.error('Jellemzők mentési hiba:', featuresError)
      } else {
        console.log(`🏷️ ${features.length} jellemző mentve`)
      }
    }

    return Response.json({
      success: true,
      property: insertedProperty,
      message: 'Apartman sikeresen feltöltve!'
    })

  } catch (error) {
    console.error('❌ API hiba:', error)
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}