package com.mediflow.pharmacy;
import android.content.Context;
import android.graphics.*;
import android.graphics.pdf.*;
import android.os.*;
import android.print.*;
import android.print.pdf.PrintedPdfDocument;
import java.io.*;
import java.util.*;
import java.util.concurrent.ExecutorService;

/** Android print adapter respecting cancellation and requested page ranges. */
final class PdfPrintAdapter extends PrintDocumentAdapter {
    private final Context context;private final File file;private final ExecutorService worker;
    private PrintAttributes attributes;
    PdfPrintAdapter(Context context,File file,ExecutorService worker){this.context=context;this.file=file;this.worker=worker;}
    @Override public void onLayout(PrintAttributes old,PrintAttributes current,CancellationSignal cancel,LayoutResultCallback callback,Bundle extras){
        attributes=current;worker.execute(()->{
            if(cancel.isCanceled()){callback.onLayoutCancelled();return;}
            try(ParcelFileDescriptor fd=ParcelFileDescriptor.open(file,ParcelFileDescriptor.MODE_READ_ONLY);PdfRenderer pdf=new PdfRenderer(fd)){
                callback.onLayoutFinished(new PrintDocumentInfo.Builder("MediFlow.pdf").setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT).setPageCount(pdf.getPageCount()).build(),!current.equals(old));
            }catch(Exception error){callback.onLayoutFailed("Unable to prepare this PDF.");}
        });
    }
    @Override public void onWrite(PageRange[] ranges,ParcelFileDescriptor destination,CancellationSignal cancel,WriteResultCallback callback){
        worker.execute(()->{
            PrintedPdfDocument output=new PrintedPdfDocument(context,attributes);
            try(ParcelFileDescriptor source=ParcelFileDescriptor.open(file,ParcelFileDescriptor.MODE_READ_ONLY);PdfRenderer renderer=new PdfRenderer(source);
                FileOutputStream stream=new FileOutputStream(destination.getFileDescriptor())){
                List<PageRange> written=new ArrayList<>();
                for(int index=0;index<renderer.getPageCount();index++){
                    if(cancel.isCanceled()){callback.onWriteCancelled();return;}
                    boolean include=false;for(PageRange range:ranges)if(index>=range.getStart()&&index<=range.getEnd())include=true;if(!include)continue;
                    Bitmap bitmap=null;
                    try(PdfRenderer.Page input=renderer.openPage(index)){
                        float scale=Math.min(2f,2000f/Math.max(input.getWidth(),input.getHeight()));
                        bitmap=Bitmap.createBitmap(Math.max(1,(int)(input.getWidth()*scale)),Math.max(1,(int)(input.getHeight()*scale)),Bitmap.Config.ARGB_8888);
                        bitmap.eraseColor(Color.WHITE);input.render(bitmap,null,null,PdfRenderer.Page.RENDER_MODE_FOR_PRINT);
                        PdfDocument.Page page=output.startPage(index);Rect area=page.getInfo().getContentRect();
                        float fit=Math.min((float)area.width()/bitmap.getWidth(),(float)area.height()/bitmap.getHeight());
                        RectF target=new RectF(area.left,area.top,area.left+bitmap.getWidth()*fit,area.top+bitmap.getHeight()*fit);
                        try{page.getCanvas().drawBitmap(bitmap,null,target,new Paint(Paint.FILTER_BITMAP_FLAG));}
                        finally{output.finishPage(page);}
                        written.add(new PageRange(index,index));
                    }finally{if(bitmap!=null)bitmap.recycle();}
                }
                if(cancel.isCanceled()){callback.onWriteCancelled();return;}
                output.writeTo(stream);callback.onWriteFinished(written.toArray(new PageRange[0]));
            }catch(Exception|OutOfMemoryError error){callback.onWriteFailed("Unable to print. Save the PDF and try again.");}
            finally{output.close();}
        });
    }
}
