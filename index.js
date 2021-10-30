import { listenKeys } from 'nanostores'
import React from 'react'

import { batch } from './batch/index.js'

export { batch }

export function useStore(store, opts = {}) {
  let [, forceRender] = React.useState({})

  if (process.env.NODE_ENV !== 'production') {
    if (typeof store === 'function') {
      throw new Error(
        'Use useStore(Template(id)) or useSync() ' +
          'from @logux/client/react for templates'
      )
    }
  }

  React.useEffect(() => {
    let rerender = () => {
      batch(() => {
        forceRender({})
      })
    }
    if (opts.keys) {
      return listenKeys(store, opts.keys, rerender)
    } else {
      return store.listen(rerender)
    }
  }, [store, '' + opts.keys])

  return store.get()
}

export function StoreWatcher({ store, opts, render }) {
  return render(useStore(store, opts))
}
