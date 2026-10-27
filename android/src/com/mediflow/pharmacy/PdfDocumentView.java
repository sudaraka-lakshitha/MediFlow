package com.mediflow.pharmacy;
import android.content.Context;
import android.graphics.*;
import android.graphics.pdf.PdfRenderer;
import android.os.ParcelFileDescriptor;
import android.view.*;
import android.widget.*;
import java.io.File;
import java.util.concurrent.ExecutorService;

/** One PDF page at a time; bound memory and release hidden-page bitmaps. */
final class PdfDocumentView extends LinearLayout {
    private final ExecutorService worker;
    private PdfRenderer renderer;
    private ParcelFileDescriptor descriptor;
    private final ImageView image;
    private final TextView label;
    private final Button previous,next;
    private int page,total,request;
    private boolean disposed,visible=true;
    private Bitmap bitmap;
    private float zoom=1;
    PdfDocumentView(Context context,File file,ExecutorService worker){
        super(context);this.worker=worker;setOrientation(VERTICAL);setBackgroundColor(0xFFEEF3F5);
        LinearLayout controls=new LinearLayout(context);controls.setGravity(Gravity.CENTER);
        previous=button("‹","Previous PDF page");next=button("›","Next PDF page");
        Button minus=button("−","Zoom out"),plus=button("+","Zoom in");
        label=new TextView(context);label.setGravity(Gravity.CENTER);label.setText("Opening PDF…");
        controls.addView(previous);controls.addView(label,new LayoutParams(0,dp(48),1));controls.addView(next);controls.addView(minus);controls.addView(plus);addView(controls);
        ScrollView vertical=new ScrollView(context);HorizontalScrollView horizontal=new HorizontalScrollView(context);
        image=new ImageView(context);image.setBackgroundColor(Color.WHITE);horizontal.addView(image);vertical.addView(horizontal);addView(vertical,new LayoutParams(-1,0,1));
        previous.setOnClickListener(v->{if(page>0){page--;zoom=1;render();}});next.setOnClickListener(v->{if(page+1<total){page++;zoom=1;render();}});
        minus.setOnClickListener(v->{zoom=Math.max(1,zoom-.5f);render();});plus.setOnClickListener(v->{zoom=Math.min(3,zoom+.5f);render();});
        previous.setEnabled(false);next.setEnabled(false);
        worker.execute(()->{
            try{descriptor=ParcelFileDescriptor.open(file,ParcelFileDescriptor.MODE_READ_ONLY);renderer=new PdfRenderer(descriptor);total=renderer.getPageCount();post(()->{if(!disposed)render();});}
            catch(Exception e){post(()->label.setText("Cannot preview this PDF. Use App actions → Save document."));}
        });
    }
    private Button button(String text,String description){
        Button b=new Button(getContext());b.setText(text);b.setContentDescription(description);b.setMinWidth(0);b.setMinimumWidth(0);
        b.setPadding(0,0,0,0);b.setLayoutParams(new LayoutParams(dp(44),dp(48)));return b;
    }
    private int dp(int n){return Math.round(n*getResources().getDisplayMetrics().density);}
    @Override protected void onSizeChanged(int w,int h,int oldw,int oldh){super.onSizeChanged(w,h,oldw,oldh);if(w!=oldw&&total>0)render();}
    void setVisible(boolean value){
        visible=value;if(value&&total>0)render();
        else if(!value){request++;image.setImageDrawable(null);if(bitmap!=null){bitmap.recycle();bitmap=null;}}
    }
    private void render(){
        if(disposed||!visible||total==0)return;
        final int generation=++request,index=page,width=Math.min(2000,Math.max(240,(int)(Math.max(getWidth(),dp(320))*zoom)));
        label.setText((page+1)+" / "+total+" · "+Math.round(zoom*100)+"%");previous.setEnabled(page>0);next.setEnabled(page+1<total);
        worker.execute(()->{
            Bitmap rendered=null;
            try{
                if(renderer==null)return;
                try(PdfRenderer.Page pdf=renderer.openPage(index)){
                    float ratio=(float)pdf.getHeight()/pdf.getWidth();int height=Math.max(1,Math.min(3000,Math.round(width*ratio)));
                    int actualWidth=Math.max(1,Math.min(2000,Math.round(height/ratio)));
                    rendered=Bitmap.createBitmap(actualWidth,height,Bitmap.Config.ARGB_8888);rendered.eraseColor(Color.WHITE);
                    pdf.render(rendered,null,null,PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
                }
                final Bitmap ready=rendered;post(()->{
                    if(disposed||!visible||request!=generation){ready.recycle();return;}
                    image.setImageBitmap(ready);image.setLayoutParams(new android.widget.FrameLayout.LayoutParams(ready.getWidth(),ready.getHeight()));
                    if(bitmap!=null)bitmap.recycle();bitmap=ready;
                });
            }catch(Exception|OutOfMemoryError failure){if(rendered!=null)rendered.recycle();post(()->{if(!disposed)label.setText("Unable to render page. Save the PDF to view it elsewhere.");});}
        });
    }
    void dispose(){
        disposed=true;request++;image.setImageDrawable(null);if(bitmap!=null){bitmap.recycle();bitmap=null;}
        worker.execute(()->{if(renderer!=null){renderer.close();renderer=null;}if(descriptor!=null)try{descriptor.close();}catch(Exception ignored){}});
    }
}
