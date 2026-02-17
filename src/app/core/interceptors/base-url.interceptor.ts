import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api/')) {
    const apiReq = req.clone({
      url: req.url.replace('/api/', `${environment.apiBaseUrl}/`),
    });
    return next(apiReq);
  }
  return next(req);
};
