import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'

const worker = setupWorker(
    http.get('http://localhost:5173/', ({ request, params, cookies }) => {
      return HttpResponse.json(
        {
          message: 'Mocked response',
        },
        {
          status: 202,
          statusText: 'Mocked status',
        },
      )
    }),
  )

  await worker.start()