import { IncomingMessage, ServerResponse } from 'http';

interface RequestHandler {
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<any>
}
export default RequestHandler;
