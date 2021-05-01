import React, { useState } from 'react'
import CircleOnSquare from './components/circle_on_square';

function App() {
  const [c1bg, setC1bg] = useState('#FFE6E6')
  const [c1txt, setC1txt] = useState('#403863')
  const [c2bg, setC2bg] = useState('#C5A3FF')
  const [c2txt, setC2txt] = useState('#0C0074')
  const [c3bg, setC3bg] = useState('#4B4185')
  const [c3txt, setC3txt] = useState('#FFFFFF')
  const [cSup, setCSup] = useState('#ff2e8c')
  const [bgContrast, setBgContrast] = useState(1.5)
  const [supContrast, setSupContrast] = useState(1.5)

  // sRGBを返す
  function getSRGB(_8bitColor) {
    return _8bitColor / 255;
  }

  // 相対輝度計算に使うためのRGBを返す
  const getRGBForCalculateLuminance = (rgb) => {
    if (rgb <= 0.03928){
      return rgb / 12.92;
    } else {
      return Math.pow(((rgb + 0.055) / 1.055), 2.4);
    }
  }

  // 相対輝度を返す
  const calcRelativeLuminance = (rgb) => {
    let R = getRGBForCalculateLuminance(getSRGB(rgb[0]));
    let G = getRGBForCalculateLuminance(getSRGB(rgb[1]));
    let B = getRGBForCalculateLuminance(getSRGB(rgb[2]));
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  const calcContrastRatio = (c1, c2) => {
    const color1 = c1.match(/[^#]{2}/g).map(rgb => parseInt(rgb, 16))
    const color2 = c2.match(/[^#]{2}/g).map(rgb => parseInt(rgb, 16))
    const l1 = calcRelativeLuminance(color1)
    const l2 = calcRelativeLuminance(color2)
    const bright = Math.max(l1, l2)
    const dark = Math.min(l1, l2)
    return Math.round((bright + 0.05) / (dark + 0.05) * 100) / 100
  }

  const judgementA11y = (contrastRatio) => {
    if (contrastRatio >= 7) {
      return 'AAA'
    } else if (contrastRatio >= 4.5) {
      return 'AA'
    } else {
      return 'NG'
    }
  }

  const judgementA11yBg = (contrastRatio) => {
    if (contrastRatio >= bgContrast) {
      return 'OK'
    }
    return 'NG'
  }

  const judgementA11ySup = (contrastRatio) => {
    if (contrastRatio >= supContrast) {
      return 'OK'
    }
    return 'NG'
  }

  const isThemeOK = () => {
    return (
      judgementA11yBg(calcContrastRatio(c1bg, c2bg)) === 'OK' &&
      judgementA11yBg(calcContrastRatio(c1bg, c3bg)) === 'OK' &&
      judgementA11yBg(calcContrastRatio(c2bg, c3bg)) === 'OK' &&
      judgementA11y(calcContrastRatio(c1bg, c1txt)) === 'AAA' &&
      judgementA11y(calcContrastRatio(c2bg, c2txt)) === 'AAA' &&
      judgementA11y(calcContrastRatio(c3bg, c3txt)) === 'AAA' &&
      judgementA11ySup(calcContrastRatio(c1bg, cSup)) === 'OK' &&
      judgementA11ySup(calcContrastRatio(c2bg, cSup)) === 'OK' &&
      judgementA11ySup(calcContrastRatio(c3bg, cSup)) === 'OK'
    )
  }

  return (
    <div className="App">
      <h2 style={{
        paddingTop: '20px',
        textAlign: 'center',
      }}>{isThemeOK() ? 'Accessible' : 'Inaccessible'}</h2>
      <div style={{
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
      }}>
        <div style={{
          width: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
          <span style={{fontSize: 30, padding: '0 15px'}}>{judgementA11yBg(calcContrastRatio(c1bg, c2bg))}</span>
          <CircleOnSquare txt={'C1'} circleColor={c1txt} squareColor={c1bg} a11y={judgementA11y(calcContrastRatio(c1bg, c1txt))}/>
          <span style={{fontSize: 30, padding: '0 15px'}}>{judgementA11yBg(calcContrastRatio(c1bg, c3bg))}</span>
          <div style={{
            position: 'absolute',
            width: '13%',
            bottom: '-16%',
            zIndex: '10',
          }}>
            <div style={{
              width: '100%',
              paddingBottom: '100%',
              borderRadius: '9999px',
              backgroundColor: cSup,
            }}/>
          </div>
        </div>
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <CircleOnSquare txt={'C2'} circleColor={c2txt} squareColor={c2bg} a11y={judgementA11y(calcContrastRatio(c2bg, c2txt))}/>
          <CircleOnSquare txt={'C3'} circleColor={c3txt} squareColor={c3bg} a11y={judgementA11y(calcContrastRatio(c3bg, c3txt))}/>
        </div>
        <p style={{
          textAlign: 'center',
          fontSize: 30,
        }}>{judgementA11yBg(calcContrastRatio(c2bg, c3bg))}</p>
      </div>

      <table border='1' style={{ margin: '30px auto', width: '100%', maxWidth: 600 }} className='table'>
        <thead className="thead-dark table-striped">
          <tr>
            <th scope="col">Color</th>
            <th scope="col">BG</th>
            <th scope="col">TXT</th>
            <th scope="col">Contrast</th>
            <th scope="col">A11y</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">C1</th>
            <td>
              <input type="color" value={c1bg} onChange={(e) => setC1bg(e.target.value)} className='form-control'/>
              <p style={{textAlign: 'center'}}>{c1bg}</p>
            </td>
            <td>
              <input type="color" value={c1txt} onChange={(e) => setC1txt(e.target.value)} className='form-control'/>
              <p style={{textAlign: 'center'}}>{c1txt}</p>
            </td>
            <td>{calcContrastRatio(c1bg, c1txt)}</td>
            <td>{judgementA11y(calcContrastRatio(c1bg, c1txt))}</td>
          </tr>
          <tr>
            <th scope="row">C2</th>
            <td>
              <input type="color" value={c2bg} onChange={(e) => setC2bg(e.target.value)} className='form-control'/>
              <p style={{textAlign: 'center'}}>{c2bg}</p>
            </td>
            <td>
              <input type="color" value={c2txt} onChange={(e) => setC2txt(e.target.value)} className='form-control'/>
              <p style={{textAlign: 'center'}}>{c2txt}</p>
            </td>
            <td>{calcContrastRatio(c2bg, c2txt)}</td>
            <td>{judgementA11y(calcContrastRatio(c2bg, c2txt))}</td>
          </tr>
          <tr>
            <th scope="row">C3</th>
            <td>
              <input type="color" value={c3bg} onChange={(e) => setC3bg(e.target.value)} className='form-control'/>
              <p style={{textAlign: 'center'}}>{c3bg}</p>
            </td>
            <td>
              <input type="color" value={c3txt} onChange={(e) => setC3txt(e.target.value)} className='form-control'/>
              <p style={{textAlign: 'center'}}>{c3txt}</p>
            </td>
            <td>{calcContrastRatio(c3bg, c3txt)}</td>
            <td>{judgementA11y(calcContrastRatio(c3bg, c3txt))}</td>
          </tr>
          <tr>
            <th scope="row">C1 - C2</th>
            <td></td>
            <td style={{ textAlign: 'right', paddingLeft: '10px' }}><input value={bgContrast} size={3} onChange={(e) => setBgContrast(e.target.value)}/>{' <'}</td>
            <td>{calcContrastRatio(c1bg, c2bg)}</td>
            <td>{judgementA11yBg(calcContrastRatio(c1bg, c2bg))}</td>
          </tr>
          <tr>
            <th scope="row">C2 - C3</th>
            <td></td>
            <td style={{ textAlign: 'right', paddingLeft: '10px' }}><input value={bgContrast} size={3} onChange={(e) => setBgContrast(e.target.value)}/>{' <'}</td>
            <td>{calcContrastRatio(c2bg, c3bg)}</td>
            <td>{judgementA11yBg(calcContrastRatio(c2bg, c3bg))}</td>
          </tr>
          <tr>
            <th scope="row">C3 - C1</th>
            <td></td>
            <td style={{ textAlign: 'right', paddingLeft: '10px' }}><input value={bgContrast} size={3} onChange={(e) => setBgContrast(e.target.value)}/>{' <'}</td>
            <td>{calcContrastRatio(c1bg, c3bg)}</td>
            <td>{judgementA11yBg(calcContrastRatio(c1bg, c3bg))}</td>
          </tr>
          <tr>
            <th scope="row">Sup - C1</th>
            <td>
              <input type="color" value={cSup} onChange={(e) => setCSup(e.target.value)} className='form-control'/>
              <p style={{textAlign: 'center'}}>{cSup}</p>
            </td>
            <td style={{ textAlign: 'right', paddingLeft: '10px' }}><input value={supContrast} size={3} onChange={(e) => setSupContrast(e.target.value)}/>{' <'}</td>
            <td>{calcContrastRatio(c1bg, cSup)}</td>
            <td>{judgementA11ySup(calcContrastRatio(c1bg, cSup))}</td>
          </tr>
          <tr>
            <th scope="row">Sup - C2</th>
            <td></td>
            <td style={{ textAlign: 'right', paddingLeft: '10px' }}><input value={supContrast} size={3} onChange={(e) => setSupContrast(e.target.value)}/>{' <'}</td>
            <td>{calcContrastRatio(c2bg, cSup)}</td>
            <td>{judgementA11ySup(calcContrastRatio(c2bg, cSup))}</td>
          </tr>
          <tr>
            <th scope="row">Sup - C3</th>
            <td></td>
            <td style={{ textAlign: 'right', paddingLeft: '10px' }}><input value={supContrast} size={3} onChange={(e) => setSupContrast(e.target.value)}/>{' <'}</td>
            <td>{calcContrastRatio(c3bg, cSup)}</td>
            <td>{judgementA11ySup(calcContrastRatio(c3bg, cSup))}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
