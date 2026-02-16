import { HttpInterceptorFn } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { from, switchMap } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  

  return from(Preferences.get({ key: 'token' })).pipe(
    switchMap(res => {
      const token = res.value;
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        
        return next(authReq);
      }

      // Si no hay token 
      return next(req);
    })
  );
};