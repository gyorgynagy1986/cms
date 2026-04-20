// pages/api/data-info.js
// Ez egy egyszerű API endpoint az adatok információinak lekérésére

import propertiesData from '../../kyero_properties.json'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Csak GET method engedélyezett' })
  }

  try {
    // Statisztikák számítása
    const count = propertiesData.length
    const totalImages = propertiesData.reduce((sum, property) => {
      return sum + (property.images ? property.images.length : 0)
    }, 0)
    
    // Első és utolsó ingatlan info
    const firstProperty = propertiesData[0]
    const lastProperty = propertiesData[propertiesData.length - 1]
    
    // Városok egyedi listája
    const uniqueTowns = [...new Set(propertiesData.map(prop => prop.town))].length
    
    // Átlag kép per ingatlan
    const avgImagesPerProperty = totalImages / count
    
    const info = {
      count,
      totalImages,
      avgImagesPerProperty: Math.round(avgImagesPerProperty * 100) / 100,
      uniqueTowns,
      firstPropertyId: firstProperty?.id,
      lastPropertyId: lastProperty?.id,
      estimatedUploadTimeMinutes: Math.ceil(count * 30 / 60), // 30 sec per property
      dataSize: JSON.stringify(propertiesData).length // bytes
    }
    
    console.log('📊 Adatinfo lekérve:', info)
    
    return res.status(200).json(info)
    
  } catch (error) {
    console.error('Adatinfo API hiba:', error)
    return res.status(500).json({ 
      message: 'Hiba az adatok olvasásakor',
      error: error.message 
    })
  }
}