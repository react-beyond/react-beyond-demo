import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { classFor } from '@react-beyond/classfor'
import { clsx } from '@react-beyond/clsx'
import { errorFallback } from '@react-beyond/errorfallback'
import { hrefHandler } from '@react-beyond/hrefhandler'
import { ifElse } from '@react-beyond/ifelse'
import { loader } from '@react-beyond/loader'
import { menu } from '@react-beyond/menu'
import { tooltip } from '@react-beyond/tooltip'
import { transpose } from '@react-beyond/transpose'
import { tw } from '@react-beyond/tw'
import { Beyond } from 'react-beyond'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Beyond
      hocs={[
        classFor({ clsx: true }),
        clsx(),
        errorFallback({}),
        hrefHandler({
          navigate: (href) => {
            console.log(`Navigating to ${href}`)
          }
        }),
        ifElse(),
        loader(),
        menu(),
        tw(),
        transpose(),
        // deepTranspose({
        //   id: 'deepTooltip',
        //   customDirective: 'x-tooltip',
        //   render: ({ self, directiveValue }) => (
        //     <Tooltip title={directiveValue}>{self}</Tooltip>
        //   )
        // }),
        tooltip({
          render: ({ self, directiveValue }) => (
            <Tooltip title={directiveValue}>{self}</Tooltip>
          )
        })
      ]}
    >
      <App x-clsx={['asdf', 'sdfg']} x-error-fallback />
    </Beyond>
  </React.StrictMode>
)
