import React, { useState } from 'react'

const ImageDiagnostic = () => {
  const [imageTest] = useState({
    localPlaceholder: '/pokemon-placeholder.svg',
    backendTest: 'http://localhost:3001/uploads/pokemon/pikachu.png',
    relativeTest: '/uploads/pokemon/pikachu.png'
  })

  const testImageLoad = (src) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = src
    })
  }

  const handleTestImages = async () => {
    console.log('Testing images...')
    
    for (const [key, src] of Object.entries(imageTest)) {
      const result = await testImageLoad(src)
      console.log(`${key} (${src}): ${result ? 'SUCCESS' : 'FAILED'}`)
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>🔍 Diagnóstico de Imágenes</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleTestImages} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Probar Carga de Imágenes
        </button>
        <p><small>Revisa la consola para ver los resultados</small></p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {Object.entries(imageTest).map(([key, src]) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <h4>{key}</h4>
            <img 
              src={src} 
              alt={key}
              style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid #ddd' }}
              onError={(e) => {
                e.target.style.border = '2px solid red'
                e.target.alt = 'ERROR'
              }}
            />
            <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>{src}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageDiagnostic
