import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClasificacionPage } from './clasificacion.page';

describe('ClasificacionPage', () => {
  let component: ClasificacionPage;
  let fixture: ComponentFixture<ClasificacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
