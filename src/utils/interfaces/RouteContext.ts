import { IncomingMessage, ServerResponse } from 'http';

/**
 * The context provided when the URL handler method is called
 */
interface RouteContext {

  /** Request info */
  request: IncomingMessage & {
    
    /**
     * Parameters in URL
     * @example /hello/:name => ctx.request.params.name
     */
    params: {
      [parameter: string]: string
    },

    /**
     * Cookies in request
     */
    cookie: {
      [name: string]: string
    }
  }
  
  /** Response features */
  response: ServerResponse
}

export default RouteContext;
