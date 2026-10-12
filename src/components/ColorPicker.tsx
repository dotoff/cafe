'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

const RECOMMENDED_COLORS = [
  { name: 'Dark Green', hex: '#1e3f20' },
  { name: 'Chocolate', hex: '#5D4037' },
  { name: 'Gold', hex: '#FBC02D' },
  { name: 'Pink', hex: '#E91E63' },
  { name: 'Cream', hex: '#FDFBF7' },
]

export const ColorPicker = ({ path, field }: any) => {
  const { value = '', setValue } = useField<string>({ path })

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'inherit' }}>
        {field?.label || 'Background Color'}
      </label>
      
      {/* Presets */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        {RECOMMENDED_COLORS.map(c => (
          <button
            key={c.hex}
            onClick={(e) => { e.preventDefault(); setValue(c.hex) }}
            title={c.name}
            style={{
              width: '28px', height: '28px', borderRadius: '50%', background: c.hex,
              border: value === c.hex ? '2px solid #000' : '1px solid #ccc',
              cursor: 'pointer', padding: 0
            }}
          />
        ))}
        <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px', alignSelf: 'center' }}>
          (Recommended Brand Palette)
        </span>
      </div>

      {/* Custom Picker */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="color" 
          value={value || '#ffffff'} 
          onChange={(e) => setValue(e.target.value)} 
          style={{ width: '40px', height: '40px', padding: '0', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input 
          type="text" 
          value={value || ''} 
          onChange={(e) => setValue(e.target.value)} 
          placeholder="#000000"
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '120px', backgroundColor: 'transparent', color: 'inherit' }}
        />
      </div>
      <p style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>
        {field?.admin?.description || 'Select a custom color from the wheel or enter a hex code.'}
      </p>
    </div>
  )
}
