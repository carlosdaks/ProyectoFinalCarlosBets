import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesEquiposPage } from './detalles-equipos.page';

describe('DetallesEquiposPage', () => {
  let component: DetallesEquiposPage;
  let fixture: ComponentFixture<DetallesEquiposPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesEquiposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
