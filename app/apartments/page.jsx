"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    town: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  const itemsPerPage = 12

  // Apartmanok betöltése
  const loadApartments = async (page = 1, currentFilters = filters) => {
    setLoading(true)
    
    try {
      const from = (page - 1) * itemsPerPage
      const to = from + itemsPerPage - 1

      // Base query
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_images!property_images_property_id_fkey (
            public_url,
            is_floorplan,
            display_order
          ),
          property_features!property_features_property_id_fkey (
            feature_name
          )
        `)
        .range(from, to)
        .order(currentFilters.sortBy, { ascending: currentFilters.sortOrder === 'asc' })

      // Szűrők alkalmazása
      if (currentFilters.search) {
        query = query.or(`title.ilike.%${currentFilters.search}%,description.ilike.%${currentFilters.search}%,town.ilike.%${currentFilters.search}%`)
      }
      
      if (currentFilters.minPrice) {
        query = query.gte('price', parseInt(currentFilters.minPrice))
      }
      
      if (currentFilters.maxPrice) {
        query = query.lte('price', parseInt(currentFilters.maxPrice))
      }
      
      if (currentFilters.bedrooms) {
        query = query.eq('bedrooms', parseInt(currentFilters.bedrooms))
      }
      
      if (currentFilters.town) {
        query = query.ilike('town', `%${currentFilters.town}%`)
      }

      const { data, error, count } = await query

      if (error) {
        console.error('Hiba az apartmanok betöltésekor:', error)
        return
      }

      // Összes eredmény számának lekérése (pagináció számára)
      let countQuery = supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })

      if (currentFilters.search) {
        countQuery = countQuery.or(`title.ilike.%${currentFilters.search}%,description.ilike.%${currentFilters.search}%,town.ilike.%${currentFilters.search}%`)
      }
      if (currentFilters.minPrice) countQuery = countQuery.gte('price', parseInt(currentFilters.minPrice))
      if (currentFilters.maxPrice) countQuery = countQuery.lte('price', parseInt(currentFilters.maxPrice))
      if (currentFilters.bedrooms) countQuery = countQuery.eq('bedrooms', parseInt(currentFilters.bedrooms))
      if (currentFilters.town) countQuery = countQuery.ilike('town', `%${currentFilters.town}%`)

      const { count: totalResults } = await countQuery
      setTotalCount(totalResults || 0)

      // Adatok feldolgozása
      const processedApartments = data?.map(apartment => ({
        ...apartment,
        mainImage: apartment.property_images
          ?.filter(img => !img.is_floorplan)
          ?.sort((a, b) => a.display_order - b.display_order)[0]?.public_url,
        allImages: apartment.property_images
          ?.filter(img => !img.is_floorplan)
          ?.sort((a, b) => a.display_order - b.display_order)
          ?.map(img => img.public_url) || [],
        features: apartment.property_features?.map(f => f.feature_name) || []
      })) || []

      setApartments(processedApartments)
      
    } catch (error) {
      console.error('Általános hiba:', error)
    } finally {
      setLoading(false)
    }
  }

  // Komponens betöltésekor
  useEffect(() => {
    loadApartments(1)
  }, [])

  // Szűrő változásokor
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    loadApartments(1, newFilters)
  }

  // Oldal váltás
  const handlePageChange = (page) => {
    setCurrentPage(page)
    loadApartments(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Ár formázás
  const formatPrice = (price, currency = 'EUR') => {
    return new Intl.NumberFormat('hu-HU').format(price) + ' ' + currency
  }

  // Pagináció számok
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const pageNumbers = []
  
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, currentPage + 2)
  
  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + 4)
    } else {
      startPage = Math.max(1, endPage - 4)
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  if (loading && apartments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Apartmanok betöltése...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🏠 Ingatlan Kereső
          </h1>
          <p className="text-gray-600 mt-2">
            {totalCount} apartman közül {apartments.length} megjelenítve
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Szűrő oldalsáv */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">🔍 Szűrők</h2>
              
              {/* Keresés */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keresés
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Város, leírás..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({...filters, search: e.target.value})}
                />
              </div>

              {/* Ár tartomány */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ár (EUR)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange({...filters, minPrice: e.target.value})}
                  />
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>

              {/* Szobák száma */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hálószobák
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange({...filters, bedrooms: e.target.value})}
                >
                  <option value="">Bármelyik</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Város */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Város
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="pl. Torrevieja"
                  value={filters.town}
                  onChange={(e) => handleFilterChange({...filters, town: e.target.value})}
                />
              </div>

              {/* Rendezés */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rendezés
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-')
                    handleFilterChange({...filters, sortBy, sortOrder})
                  }}
                >
                  <option value="created_at-desc">Legújabb</option>
                  <option value="price-asc">Ár növekvő</option>
                  <option value="price-desc">Ár csökkenő</option>
                  <option value="bedrooms-desc">Szobák száma</option>
                  <option value="surface_area-desc">Terület</option>
                </select>
              </div>

              {/* Szűrők törlése */}
              <button
                onClick={() => {
                  const resetFilters = {
                    search: '', minPrice: '', maxPrice: '', bedrooms: '', town: '', 
                    sortBy: 'created_at', sortOrder: 'desc'
                  }
                  handleFilterChange(resetFilters)
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-200 transition"
              >
                🔄 Szűrők törlése
              </button>
            </div>
          </div>

          {/* Apartman lista */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : apartments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nincs találat</h3>
                <p className="text-gray-500">Próbáld meg módosítani a szűrőket.</p>
              </div>
            ) : (
              <>
                {/* Apartman kártyák */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {apartments.map((apartment) => (
                    <div key={apartment.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Kép */}
                      <div className="relative h-48 bg-gray-200">
                        {apartment.mainImage ? (
                          <img
                            src={apartment.mainImage}
                            alt={apartment.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            🏠 Nincs kép
                          </div>
                        )}
                        
                        {/* Ár badge */}
                        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {formatPrice(apartment.price, apartment.currency)}
                        </div>
                        
                        {/* Képek száma */}
                        {apartment.allImages.length > 0 && (
                          <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            📷 {apartment.allImages.length}
                          </div>
                        )}
                      </div>

                      {/* Tartalom */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {apartment.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {apartment.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>📍 {apartment.town}, {apartment.province}</span>
                          <span>📐 {apartment.surface_area} m²</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex space-x-4">
                            <span className="flex items-center">
                              🛏️ {apartment.bedrooms} szoba
                            </span>
                            <span className="flex items-center">
                              🚿 {apartment.bathrooms} fürdő
                            </span>
                          </div>
                        </div>
                        
                        {/* Jellemzők */}
                        {apartment.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {apartment.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                            {apartment.features.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{apartment.features.length - 3} további
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            ID: {apartment.external_id}
                          </span>
                          <Link 
                            href={`/apartments/${apartment.external_id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                          >
                            Részletek
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagináció */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Előző
                    </button>
                    
                    {startPage > 1 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          1
                        </button>
                        {startPage > 2 && <span className="text-gray-500">...</span>}
                      </>
                    )}
                    
                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm border rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    {endPage < totalPages && (
                      <>
                        {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Következő →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}