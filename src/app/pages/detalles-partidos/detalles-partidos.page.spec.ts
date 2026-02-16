import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesPartidosPage } from './detalles-partidos.page';

describe('DetallesPartidosPage', () => {
  let component: DetallesPartidosPage;
  let fixture: ComponentFixture<DetallesPartidosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesPartidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
