import { IncomingMessage, ServerResponse } from 'http';

/**
 * The context provided when the URL handler method is called
 */
interface RouteContext {

  /** Request info */
  request: {
    
    /**
     * Parameters in URL
     * @example /hello/:name => ctx.request.params.name
     */
    params: {
      [parameter: string]: string
    }
  } & IncomingMessage
  
  /** Response features */
  response: ServerResponse
}

export default RouteContext;
