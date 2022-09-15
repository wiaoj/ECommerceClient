import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { List_Product_Image } from 'src/app/contracts/product/List_Product_Image';
import { DialogService } from 'src/app/services/common/dialog.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';
import { SpinnerType } from '../../base.component';
import { BaseDialog } from '../base/base-dialog';
import { DeleteDialogComponent, DeleteState } from '../delete-dialog/delete-dialog.component';

declare var $: any;

@Component({
  selector: 'app-select-product-image-dialog',
  templateUrl: './select-product-image-dialog.component.html',
  styleUrls: ['./select-product-image-dialog.component.scss'],
})
export class SelectProductImageDialogComponent
  extends BaseDialog<SelectProductImageDialogComponent>
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<SelectProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectProductImageState | string,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService
  ) {
    super(dialogRef);
  }

  @Output() options: Partial<FileUploadOptions> = {
    accept: '.png, .jpg, .jpeg, .gif',
    action: 'upload',
    controller: 'products',
    explanation: 'Ürün resmini seçin veya buraya sürükleyin',
    isAdminPage: true,
    queryString: `id=${this.data}`,
  };

  images: List_Product_Image[];

  async ngOnInit(): Promise<void> {
    this.spinner.show(SpinnerType.LineSpinFade);
    this.images = await this.productService.readImages(
      this.data as string,
      () => {
        this.spinner.hide(SpinnerType.LineSpinFade);
      }
    );
  }

  async deleteImage(imageId: string, event: any) {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data:DeleteState.Yes,
      afterClosed : async () => {
        this.spinner.show(SpinnerType.LineSpinFade);
        await this.productService.deleteImage(this.data as string, imageId, () => {
          this.spinner.hide(SpinnerType.LineSpinFade);
          $(event.srcElement).parent().parent().fadeOut(500);
        });
      },
    })
  }
}

export enum SelectProductImageState {
  Close,
}
