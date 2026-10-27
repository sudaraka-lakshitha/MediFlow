package com.mediflow.pharmacy;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.net.http.SslError;
import android.os.*;
import android.print.PrintManager;
import android.view.*;
import android.webkit.*;
import android.widget.*;
import org.json.JSONObject;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.concurrent.*;

/** Native navigation and private document tabs; no JavaScript interfaces or browser toolbar. */
public final class MainActivity extends Activity {
    private static final int PICK_FILE=100, SAVE_FILE=101, MAX_TABS=6;
    private final Handler ui=new Handler(Looper.getMainLooper());
    final ExecutorService documents=Executors.newSingleThreadExecutor();
    private final List<Tab> tabs=new ArrayList<>();
    private final Map<String,Transfer> transfers=new HashMap<>();
    private FrameLayout content;
    private ProgressBar progress;
    private TextView title;
    private Button tabButton;
    private Tab selected;
    private File privateDocuments,savePending;
    private ValueCallback<Uri[]> fileChooser;
    private boolean destroyed;
    private int sessionGeneration;
    private String bridgeScript;
    private String viewModeScript;
    private boolean desktopView;
    private static final class Tab {
        String name="MediFlow",mime;
        View view; WebView web; PdfDocumentView pdf; File file; WebMessagePort bridge;
        boolean closed,loading,failed,document;
        int generation;
    }
    private static final class Transfer {
        File file; FileOutputStream output; Tab owner; String name,mime;
        long size,lastActivity=SystemClock.uptimeMillis();
        volatile boolean closed;
        boolean busy;
    }
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        desktopView=getSharedPreferences("display",MODE_PRIVATE).getBoolean("desktopView",false);
        privateDocuments=new File(getCacheDir(),"mediflow-documents-v2");
        privateDocuments.mkdirs();
        File[] previous=privateDocuments.listFiles();
        if(previous!=null)for(File file:previous)if(file.isFile())file.delete();
        try{
            bridgeScript=readAsset("native-bridge.js");
            viewModeScript=readAsset("view-mode.js");
        }catch(IOException error){
            new AlertDialog.Builder(this).setTitle("MediFlow could not start").setMessage("Please reinstall the app. Your online records are unaffected.")
                .setPositiveButton("Close",(d,w)->finish()).setCancelable(false).show();return;
        }
        buildChrome();
        if(Build.VERSION.SDK_INT>=33)getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,this::back);
        createWebTab(SitePolicy.HOME,false);
        ui.postDelayed(new Runnable(){public void run(){
            if(destroyed)return;
            for(Map.Entry<String,Transfer> entry:new ArrayList<>(transfers.entrySet()))
                if(SystemClock.uptimeMillis()-entry.getValue().lastActivity>60000)abort(entry.getKey());
            ui.postDelayed(this,30000);
        }},30000);
    }
    private String readAsset(String name)throws IOException{
        try(InputStream source=getAssets().open(name)){
            ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] buffer=new byte[8192];int count;
            while((count=source.read(buffer))!=-1)out.write(buffer,0,count);
            return out.toString("UTF-8");
        }
    }
    private void applyViewMode(Tab tab){
        if(tab.web==null||tab.document||tab.closed||!SitePolicy.trusted(tab.web.getUrl()))return;
        // Change layout without reloading: keep unsaved forms and active operations intact.
        tab.web.evaluateJavascript(viewModeScript.replace("__DESKTOP_MODE__",desktopView?"true":"false"),null);
    }
    private void chooseViewMode(){
        new AlertDialog.Builder(this).setTitle("Website view")
            .setSingleChoiceItems(new String[]{"Mobile view (recommended)","Desktop view"},desktopView?1:0,(dialog,index)->{
                desktopView=index==1;
                getSharedPreferences("display",MODE_PRIVATE).edit().putBoolean("desktopView",desktopView).apply();
                for(Tab tab:tabs)applyViewMode(tab);
                dialog.dismiss();
                notifyUser(desktopView?"Desktop view enabled. Pinch to zoom for easier reading.":"Mobile view enabled.");
            }).setNegativeButton("Cancel",null).show();
    }
    private void buildChrome(){
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setBackgroundColor(Color.WHITE);
        if(Build.VERSION.SDK_INT>=30){
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((view,insets)->{
                android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars()),keyboard=insets.getInsets(WindowInsets.Type.ime());
                view.setPadding(bars.left,bars.top,bars.right,Math.max(bars.bottom,keyboard.bottom));return insets;
            });
        }else root.setFitsSystemWindows(true);
        progress=new ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal);progress.setMax(100);
        root.addView(progress,new LinearLayout.LayoutParams(-1,dp(3)));
        content=new FrameLayout(this);root.addView(content,new LinearLayout.LayoutParams(-1,0,1));
        LinearLayout bar=new LinearLayout(this);bar.setGravity(Gravity.CENTER_VERTICAL);bar.setPadding(dp(4),dp(3),dp(4),dp(3));bar.setBackgroundColor(0xFF123244);
        Button back=chromeButton("‹","Go back");back.setOnClickListener(v->back());bar.addView(back,new LinearLayout.LayoutParams(dp(48),dp(48)));
        title=new TextView(this);title.setTextColor(Color.WHITE);title.setTextSize(14);title.setMaxLines(2);title.setGravity(Gravity.CENTER_VERTICAL);title.setPadding(dp(8),0,dp(4),0);
        title.setContentDescription("Return to the main MediFlow screen");title.setOnClickListener(v->{if(!tabs.isEmpty())select(tabs.get(0));});
        bar.addView(title,new LinearLayout.LayoutParams(0,dp(48),1));
        tabButton=chromeButton("Tabs 1","Show open tabs");tabButton.setOnClickListener(v->showTabs());bar.addView(tabButton,new LinearLayout.LayoutParams(dp(76),dp(48)));
        Button more=chromeButton("⋮","App actions");more.setOnClickListener(v->actions());bar.addView(more,new LinearLayout.LayoutParams(dp(48),dp(48)));
        root.addView(bar);setContentView(root);
    }
    private Button chromeButton(String text,String description){
        Button button=new Button(this);button.setText(text);button.setAllCaps(false);button.setTextColor(Color.WHITE);button.setTextSize(16);
        button.setBackgroundColor(Color.TRANSPARENT);button.setPadding(0,0,0,0);button.setContentDescription(description);return button;
    }
    int dp(int value){return Math.round(value*getResources().getDisplayMetrics().density);}
    void notifyUser(String message){if(!destroyed)Toast.makeText(this,message,Toast.LENGTH_LONG).show();}
    private boolean room(){if(tabs.size()<MAX_TABS)return true;notifyUser("Close a tab before opening another document (maximum 6).");return false;}
    private void select(Tab tab){
        if(tab.closed||destroyed)return;
        if(selected!=null&&selected.pdf!=null)selected.pdf.setVisible(false);
        content.removeAllViews();selected=tab;content.addView(tab.view,new FrameLayout.LayoutParams(-1,-1));
        if(tab.pdf!=null)tab.pdf.setVisible(true);refreshChrome();
    }
    private void refreshChrome(){
        if(selected==null)return;title.setText(selected.name);tabButton.setText("Tabs "+tabs.size());
        progress.setVisibility(selected.loading?View.VISIBLE:View.INVISIBLE);
    }
    @SuppressWarnings("SetJavaScriptEnabled")
    private Tab createWebTab(String url,boolean document){
        if(!room())return null;
        Tab tab=new Tab();tab.document=document;WebView web=new WebView(this);tab.web=web;tab.view=web;web.setBackgroundColor(Color.WHITE);
        WebSettings settings=web.getSettings();
        settings.setJavaScriptEnabled(!document);settings.setDomStorageEnabled(!document);
        settings.setAllowFileAccess(false);settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setSupportMultipleWindows(!document);settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setLoadWithOverviewMode(true);settings.setUseWideViewPort(true);settings.setBuiltInZoomControls(true);settings.setDisplayZoomControls(false);
        settings.setBlockNetworkLoads(document);settings.setUserAgentString(settings.getUserAgentString()+" MediFlowAndroid/2.0");
        CookieManager.getInstance().setAcceptCookie(true);CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
        web.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){return request.isForMainFrame()&&navigate(tab,request.getUrl().toString());}
            @Override public boolean shouldOverrideUrlLoading(WebView view,String target){return navigate(tab,target);}
            @Override public void onPageStarted(WebView view,String target,android.graphics.Bitmap icon){
                tab.generation++;tab.loading=true;tab.failed=false;disconnect(tab);
                if(!tab.document)tab.name=SitePolicy.trusted(target)?"MediFlow":externalTitle(target);refreshChrome();
            }
            @Override public void onPageFinished(WebView view,String target){
                tab.loading=false;if(!tab.failed&&!tab.document&&SitePolicy.trusted(target)){applyViewMode(tab);connect(tab);}refreshChrome();
            }
            @Override public void doUpdateVisitedHistory(WebView view,String target,boolean reload){
                if(!tabs.isEmpty()&&tab==tabs.get(0)&&SitePolicy.trusted(target)&&"/login".equals(Uri.parse(target).getPath())){
                    sessionGeneration++;
                    for(Tab other:new ArrayList<>(tabs))if(other!=tab)close(other);
                    for(String id:new ArrayList<>(transfers.keySet()))abort(id);
                }
            }
            @Override public void onReceivedSslError(WebView view,SslErrorHandler handler,SslError error){
                handler.cancel();notifyUser("The secure connection could not be verified. Check the device date and connection.");
            }
            @Override public void onReceivedError(WebView view,WebResourceRequest request,WebResourceError error){
                if(request.isForMainFrame()){tab.failed=true;tab.loading=false;refreshChrome();notifyUser("Unable to load this page. Check your connection, then use App actions → Reload.");}
            }
        });
        web.setWebChromeClient(new WebChromeClient(){
            @Override public void onProgressChanged(WebView view,int value){if(selected==tab)progress.setProgress(value);}
            @Override public boolean onCreateWindow(WebView view,boolean dialog,boolean userGesture,Message result){
                if(!userGesture||tab.document)return false;
                Tab child=createWebTab(null,false);if(child==null)return false;
                ((WebView.WebViewTransport)result.obj).setWebView(child.web);result.sendToTarget();return true;
            }
            @Override public void onCloseWindow(WebView window){close(tab);}
            @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
                if(!SitePolicy.trusted(view.getUrl())||tab.document){callback.onReceiveValue(null);return true;}
                if(fileChooser!=null)fileChooser.onReceiveValue(null);fileChooser=callback;
                Intent picker=new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*");
                List<String> types=new ArrayList<>();
                for(String value:params.getAcceptTypes())for(String part:value.split(",")){
                    String type=part.trim();if(type.matches("[a-zA-Z0-9.+-]+/[a-zA-Z0-9.+*-]+"))types.add(type);
                }
                if(!types.isEmpty())picker.putExtra(Intent.EXTRA_MIME_TYPES,types.toArray(new String[0]));
                picker.putExtra(Intent.EXTRA_ALLOW_MULTIPLE,params.getMode()==FileChooserParams.MODE_OPEN_MULTIPLE);
                try{startActivityForResult(picker,PICK_FILE);}catch(ActivityNotFoundException e){fileChooser=null;callback.onReceiveValue(null);notifyUser("No file picker is available.");}
                return true;
            }
            @Override public boolean onJsAlert(WebView v,String url,String message,JsResult result){
                new AlertDialog.Builder(MainActivity.this).setMessage(message).setPositiveButton("OK",(d,w)->result.confirm()).setOnCancelListener(d->result.cancel()).show();return true;
            }
            @Override public boolean onJsConfirm(WebView v,String url,String message,JsResult result){
                new AlertDialog.Builder(MainActivity.this).setMessage(message).setPositiveButton("Continue",(d,w)->result.confirm())
                    .setNegativeButton("Cancel",(d,w)->result.cancel()).setOnCancelListener(d->result.cancel()).show();return true;
            }
        });
        web.setDownloadListener((target,userAgent,disposition,mime,size)->{
            if(target.startsWith("blob:")&&tab.bridge!=null)web.evaluateJavascript("window.__mediflowOpenDocument("+JSONObject.quote(target)+","+
                JSONObject.quote(URLUtil.guessFileName(target,disposition,mime))+")",null);
            else if(SitePolicy.downloadable(target))download(target,URLUtil.guessFileName(target,disposition,mime));
            else notifyUser("This download is outside MediFlow and was not opened.");
        });
        tabs.add(tab);select(tab);if(url!=null)web.loadUrl(url);return tab;
    }
    private boolean navigate(Tab tab,String target){
        if(tab.document)return true;
        if("about:blank".equals(target))return false;
        if(SitePolicy.https(target)){
            if(Uri.parse(target).getPath().toLowerCase(Locale.ROOT).endsWith(".pdf")&&SitePolicy.downloadable(target)){
                download(target,URLUtil.guessFileName(target,null,"application/pdf"));return true;
            }return false;
        }
        if(target.startsWith("mailto:")||target.startsWith("tel:")){
            try{startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(target)));}catch(ActivityNotFoundException ignored){notifyUser("No app can handle this link.");}
        }else notifyUser("This type of link is not supported.");
        return true;
    }
    private String externalTitle(String target){String host=Uri.parse(target).getHost();return host==null?"New tab":"External · "+host;}
    private void connect(Tab tab){
        if(tab.bridge!=null||tab.closed||destroyed)return;
        final int generation=tab.generation;WebMessagePort[] ports=tab.web.createWebMessageChannel();tab.bridge=ports[0];
        ports[0].setWebMessageCallback(new WebMessagePort.WebMessageCallback(){
            @Override public void onMessage(WebMessagePort port,WebMessage message){
                if(destroyed||tab.closed||tab.generation!=generation||!SitePolicy.trusted(tab.web.getUrl()))return;
                handleMessage(tab,port,message.getData());
            }
        },ui);
        String token=UUID.randomUUID().toString();
        tab.web.evaluateJavascript(bridgeScript.replace("__CHANNEL_TOKEN__",token),ignored->{
            if(tab.closed||tab.generation!=generation||tab.bridge!=ports[0])return;
            tab.web.postWebMessage(new WebMessage(token,new WebMessagePort[]{ports[1]}),Uri.parse(SitePolicy.ORIGIN));
        });
    }
    private void disconnect(Tab tab){
        if(tab.bridge!=null){tab.bridge.close();tab.bridge=null;}
        for(Map.Entry<String,Transfer> entry:new ArrayList<>(transfers.entrySet()))if(entry.getValue().owner==tab)abort(entry.getKey());
    }
    private void reply(WebMessagePort port,String id,String transfer,String error){
        if(destroyed)return;
        try{JSONObject value=new JSONObject().put("id",id);if(transfer!=null)value.put("transfer",transfer);if(error!=null)value.put("error",error);
            port.postMessage(new WebMessage(value.toString()));}catch(Exception ignored){}
    }
    private void handleMessage(Tab owner,WebMessagePort port,String raw){
        String id="";
        try{
            if(raw==null||raw.length()>1100000)return;
            JSONObject request=new JSONObject(raw);id=request.getString("id");if(id.length()>32)return;
            String type=request.getString("type");
            if("link".equals(type)){
                String target=request.getString("url");if(!SitePolicy.https(target)||!room())throw new IOException("Unable to open this link.");
                if(SitePolicy.downloadable(target)&&Uri.parse(target).getPath().toLowerCase(Locale.ROOT).endsWith(".pdf"))download(target,"MediFlow-document.pdf");
                else createWebTab(target,false);
                reply(port,id,null,null);
            }else if("html".equals(type)){
                String html=request.getString("html");if(html.length()>1000000||!room())throw new IOException("Print preview is too large or too many tabs are open.");
                Tab tab=createWebTab(null,true);tab.name=SitePolicy.filename(request.optString("name","Print preview"));
                tab.web.loadDataWithBaseURL("https://documents.mediflow.invalid/",html,"text/html","UTF-8",null);refreshChrome();reply(port,id,null,null);
            }else if("begin".equals(type)){
                if(transfers.size()>=2||!room())throw new IOException("Finish the current document or close a tab first.");
                Transfer transfer=new Transfer();transfer.owner=owner;transfer.name=SitePolicy.filename(request.optString("name"));transfer.mime=request.optString("mime","application/octet-stream");
                transfer.file=File.createTempFile("doc-",".tmp",privateDocuments);transfer.output=new FileOutputStream(transfer.file);
                String key=UUID.randomUUID().toString();transfers.put(key,transfer);reply(port,id,key,null);
            }else{
                String key=request.getString("transfer");Transfer transfer=transfers.get(key);
                if(transfer==null||transfer.owner!=owner||transfer.closed)throw new IOException("Document transfer expired; please open it again.");
                transfer.lastActivity=SystemClock.uptimeMillis();
                if("abort".equals(type)){abort(key);reply(port,id,null,null);return;}
                if(transfer.busy)throw new IOException("Wait for the previous document chunk.");
                final String replyId=id;
                if("chunk".equals(type)){
                    String data=request.getString("data");if(data.length()>44000)throw new IOException("Document chunk is too large.");
                    byte[] bytes=android.util.Base64.decode(data,android.util.Base64.DEFAULT);
                    if(transfer.size+bytes.length>SitePolicy.MAX_DOCUMENT_BYTES){abort(key);throw new IOException("Documents must be 25 MB or smaller.");}
                    transfer.size+=bytes.length;transfer.busy=true;
                    documents.execute(()->{
                        String error=null;try{if(transfer.closed)throw new IOException();transfer.output.write(bytes);}catch(IOException failure){error="Unable to receive the document.";}
                        final String result=error;ui.post(()->{transfer.busy=false;if(result!=null)abort(key);reply(port,replyId,null,result);});
                    });
                }else if("end".equals(type)){
                    transfer.busy=true;documents.execute(()->{
                        String error=null;try{transfer.output.close();if(transfer.closed||transfer.size==0)throw new IOException();}catch(IOException failure){error="The document is empty or could not be opened.";}
                        final String result=error;ui.post(()->{
                            transfers.remove(key);
                            if(destroyed||owner.closed||transfer.closed||result!=null)transfer.file.delete();else openDocument(transfer.file,transfer.name,transfer.mime);
                            reply(port,replyId,null,result);
                        });
                    });
                }else throw new IOException("Unsupported app action.");
            }
        }catch(Exception error){reply(port,id,null,error.getMessage()==null?"Unable to open this document.":error.getMessage());}
    }
    private void abort(String id){
        Transfer transfer=transfers.remove(id);if(transfer==null)return;transfer.closed=true;
        documents.execute(()->{try{transfer.output.close();}catch(IOException ignored){}transfer.file.delete();});
    }
    private void download(String target,String name){
        if(!room())return;notifyUser("Opening document…");
        final int session=sessionGeneration;
        documents.execute(()->{
            File file=null;String mime="application/octet-stream";
            try{
                String current=target;
                for(int redirects=0;redirects<5;redirects++){
                    if(!SitePolicy.downloadable(current))throw new IOException("The download redirected outside MediFlow.");
                    HttpURLConnection connection=(HttpURLConnection)new URL(current).openConnection();
                    connection.setInstanceFollowRedirects(false);connection.setConnectTimeout(15000);connection.setReadTimeout(30000);
                    try{
                        int status=connection.getResponseCode();
                        if(status>=300&&status<400){current=new URL(new URL(current),connection.getHeaderField("Location")).toString();continue;}
                        if(status!=200)throw new IOException("Download unavailable. Open the document from its signed-in MediFlow screen.");
                        String length=connection.getHeaderField("Content-Length");
                        if(length!=null&&Long.parseLong(length)>SitePolicy.MAX_DOCUMENT_BYTES)throw new IOException("Documents must be 25 MB or smaller.");
                        mime=connection.getContentType();file=File.createTempFile("doc-",".tmp",privateDocuments);
                        try(InputStream input=connection.getInputStream();FileOutputStream output=new FileOutputStream(file)){
                            byte[] buffer=new byte[32768];long size=0;int count;
                            while((count=input.read(buffer))!=-1){size+=count;if(size>SitePolicy.MAX_DOCUMENT_BYTES)throw new IOException("Document exceeds 25 MB.");output.write(buffer,0,count);}
                        }
                        final File result=file;final String resultMime=mime;
                        ui.post(()->{if(destroyed||session!=sessionGeneration)result.delete();else openDocument(result,name,resultMime);});return;
                    }finally{connection.disconnect();}
                }throw new IOException("Too many document redirects.");
            }catch(Exception error){if(file!=null)file.delete();ui.post(()->notifyUser(error.getMessage()==null?"Unable to download the document.":error.getMessage()));}
        });
    }
    private void openDocument(File file,String name,String suppliedMime){
        if(!room()){file.delete();return;}
        Tab tab=new Tab();tab.document=true;tab.file=file;tab.name=SitePolicy.filename(name);
        tab.mime=suppliedMime==null?"application/octet-stream":suppliedMime.split(";")[0];
        try(FileInputStream input=new FileInputStream(file)){byte[] magic=new byte[5];if(input.read(magic)==5&&"%PDF-".equals(new String(magic,"US-ASCII")))tab.mime="application/pdf";}catch(IOException ignored){}
        if("application/pdf".equals(tab.mime)){
            if(!tab.name.toLowerCase(Locale.ROOT).endsWith(".pdf"))tab.name+=".pdf";
            tab.pdf=new PdfDocumentView(this,file,documents);tab.view=tab.pdf;
        }else{
            LinearLayout panel=new LinearLayout(this);panel.setOrientation(LinearLayout.VERTICAL);panel.setPadding(dp(24),dp(24),dp(24),dp(24));
            TextView text=new TextView(this);text.setText(tab.name+"\n\nDocument ready to save.\n"+(file.length()/1024)+" KB");text.setTextSize(18);panel.addView(text);
            Button save=new Button(this);save.setText("Save to device");save.setOnClickListener(v->save(tab));panel.addView(save);
            if(tab.mime.startsWith("image/")){
                ImageView image=new ImageView(this);image.setAdjustViewBounds(true);panel.addView(image,new LinearLayout.LayoutParams(-1,0,1));
                documents.execute(()->{
                    android.graphics.BitmapFactory.Options options=new android.graphics.BitmapFactory.Options();
                    options.inJustDecodeBounds=true;android.graphics.BitmapFactory.decodeFile(file.getPath(),options);options.inSampleSize=1;
                    while(Math.max(options.outWidth,options.outHeight)/options.inSampleSize>1600)options.inSampleSize*=2;
                    options.inJustDecodeBounds=false;
                    android.graphics.Bitmap bitmap=android.graphics.BitmapFactory.decodeFile(file.getPath(),options);
                    ui.post(()->{if(tab.closed||destroyed){if(bitmap!=null)bitmap.recycle();}else image.setImageBitmap(bitmap);});
                });
            }tab.view=panel;
        }tabs.add(tab);select(tab);
    }
    private void actions(){
        if(selected==null)return;final Tab tab=selected;List<String> labels=new ArrayList<>();
        if(tab.file!=null)labels.add("Save document");if(tab.pdf!=null||tab.web!=null)labels.add("Print");
        labels.add("Website view: "+(desktopView?"Desktop":"Mobile"));
        if(tab.web!=null&&!tab.document)labels.add("Reload page");if(tabs.indexOf(tab)>0)labels.add("Close tab");labels.add("About MediFlow");
        new AlertDialog.Builder(this).setItems(labels.toArray(new String[0]),(d,index)->{
            String action=labels.get(index);
            if(action.startsWith("Website view:")){chooseViewMode();return;}
            if(action.equals("Save document"))save(tab);else if(action.equals("Print"))print(tab);else if(action.equals("Close tab"))close(tab);
            else if(action.equals("Reload page"))new AlertDialog.Builder(this).setMessage("Reload this page? Unsaved form entries may be lost.")
                .setPositiveButton("Reload",(a,b)->tab.web.reload()).setNegativeButton("Cancel",null).show();
            else new AlertDialog.Builder(this).setTitle("MediFlow 2.0").setMessage("App navigation and private document tabs.\n\nWebsite: "+SitePolicy.ORIGIN+
                "\n\nClinical records and payments require a connection. Documents stay in temporary app storage until closed; saving is your choice.").setPositiveButton("OK",null).show();
        }).show();
    }
    private void showTabs(){
        String[] names=new String[tabs.size()];for(int i=0;i<tabs.size();i++)names[i]=(tabs.get(i)==selected?"● ":"")+tabs.get(i).name;
        new AlertDialog.Builder(this).setTitle("Open tabs").setItems(names,(d,i)->select(tabs.get(i))).setNegativeButton("Done",null).show();
    }
    private void print(Tab tab){
        PrintManager manager=(PrintManager)getSystemService(PRINT_SERVICE);
        try{
            if(tab.pdf!=null)manager.print(tab.name,new PdfPrintAdapter(this,tab.file,documents),null);
            else if(tab.web!=null&&!tab.loading)manager.print(tab.name,tab.web.createPrintDocumentAdapter(tab.name),null);
            else notifyUser("Wait for the document to finish loading.");
        }catch(Exception error){notifyUser("Printing is unavailable. Save the PDF instead.");}
    }
    private void save(Tab tab){
        if(savePending!=null){notifyUser("Finish the current save first.");return;}
        if(tab.file==null||!tab.file.isFile())return;savePending=tab.file;
        String mime=tab.mime!=null&&tab.mime.matches("[a-zA-Z0-9.+-]+/[a-zA-Z0-9.+-]+")?tab.mime:"application/octet-stream";
        Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType(mime).putExtra(Intent.EXTRA_TITLE,tab.name);
        try{startActivityForResult(intent,SAVE_FILE);}catch(ActivityNotFoundException error){savePending=null;notifyUser("No document saver is available.");}
    }
    @Override protected void onActivityResult(int request,int result,Intent data){
        super.onActivityResult(request,result,data);
        if(request==PICK_FILE&&fileChooser!=null){
            List<Uri> uris=new ArrayList<>();
            if(result==RESULT_OK&&data!=null){
                if(data.getClipData()!=null)for(int i=0;i<data.getClipData().getItemCount();i++)uris.add(data.getClipData().getItemAt(i).getUri());
                else if(data.getData()!=null)uris.add(data.getData());
            }
            for(Iterator<Uri> it=uris.iterator();it.hasNext();)if(!"content".equals(it.next().getScheme()))it.remove();
            fileChooser.onReceiveValue(uris.isEmpty()?null:uris.toArray(new Uri[0]));fileChooser=null;
        }else if(request==SAVE_FILE){
            File file=savePending;savePending=null;Uri target=data==null?null:data.getData();
            if(result!=RESULT_OK||file==null||target==null||!"content".equals(target.getScheme()))return;
            documents.execute(()->{
                try(InputStream input=new FileInputStream(file);OutputStream output=getContentResolver().openOutputStream(target,"w")){
                    if(output==null)throw new IOException();byte[] bytes=new byte[32768];int count;
                    while((count=input.read(bytes))!=-1)output.write(bytes,0,count);ui.post(()->notifyUser("Document saved."));
                }catch(IOException error){ui.post(()->notifyUser("Unable to save this document. Please try again."));}
            });
        }
    }
    private void close(Tab tab){
        if(tab.closed||tabs.indexOf(tab)<=0)return;tab.closed=true;disconnect(tab);
        if(selected==tab)content.removeAllViews();
        if(tab.pdf!=null)tab.pdf.dispose();if(tab.web!=null){tab.web.stopLoading();tab.web.destroy();}
        if(tab.file!=null)documents.execute(()->tab.file.delete());tabs.remove(tab);
        if(selected==tab)select(tabs.get(0));else refreshChrome();
    }
    private void back(){
        if(selected==null){finish();return;}
        if(selected.web!=null&&!selected.document&&selected.web.canGoBack())selected.web.goBack();
        else if(tabs.indexOf(selected)>0)close(selected);else finish();
    }
    @Override public void onBackPressed(){back();}
    @Override protected void onPause(){super.onPause();CookieManager.getInstance().flush();for(Tab t:tabs)if(t.web!=null)t.web.onPause();}
    @Override protected void onResume(){super.onResume();for(Tab t:tabs)if(t.web!=null)t.web.onResume();}
    @Override protected void onDestroy(){
        destroyed=true;ui.removeCallbacksAndMessages(null);
        if(fileChooser!=null){fileChooser.onReceiveValue(null);fileChooser=null;}
        for(String id:new ArrayList<>(transfers.keySet()))abort(id);
        if(content!=null)content.removeAllViews();
        for(Tab t:tabs){t.closed=true;disconnect(t);if(t.pdf!=null)t.pdf.dispose();if(t.web!=null)t.web.destroy();if(t.file!=null)documents.execute(()->t.file.delete());}
        documents.shutdown();super.onDestroy();
    }
}
