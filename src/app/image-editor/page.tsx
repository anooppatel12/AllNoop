
import { ImageEditor } from '@/components/image-editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImageEditorPage() {
  return (
    <div className="h-full w-full">
      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Free Online Image Editor
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            A powerful, browser-based image editor with AI tools, filters, and essential editing features. No software installation needed.
          </p>
        </div>

         <Card className="mt-8">
            <CardHeader>
              <CardTitle>Welcome to the All-in-One Image Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our image editor is designed to be your quick and easy solution for all basic photo editing needs. Whether you're preparing images for social media, a presentation, or just for fun, our tool provides the features you need without the complexity of professional software like Photoshop. Best of all, it works entirely in your browser, ensuring your images remain private and secure on your device.
              </p>
              <h3 className="font-semibold text-foreground">Key Features:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>AI-Powered Tools:</strong> Instantly remove the background from an image or replace it with a new one generated from a text prompt.</li>
                <li><strong>Cropping & Resizing:</strong> Easily crop your images with a freeform or fixed-ratio selection, and resize them to exact dimensions for any platform.</li>
                <li><strong>Filters:</strong> Apply a variety of classic filters like Grayscale, Sepia, and Invert with a single click.</li>
                <li><strong>Adjustments:</strong> Use the brush tool to erase parts of your image or restore them from the original.</li>
                <li><strong>Export Options:</strong> Download your finished image as a high-quality PNG or a compressed JPEG file.</li>
              </ul>
            </CardContent>
         </Card>
      </div>

      <ImageEditor />
    </div>
  );
}
