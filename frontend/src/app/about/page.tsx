import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Heart } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">About BookStore</h1>
            <p className="text-xl text-muted-foreground">
              Your trusted partner in discovering amazing books and building a community of readers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 mb-2" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe that books have the power to transform lives, spark imagination, and connect people across
                  cultures. Our mission is to make quality books accessible to everyone, everywhere.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 mb-2" />
                <CardTitle>Our Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  With thousands of satisfied customers worldwide, we've built a community of book lovers who trust us
                  to deliver exceptional reading experiences and outstanding customer service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 mb-2" />
                <CardTitle>Quality Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every book in our collection is carefully selected for quality and relevance. We partner with trusted
                  publishers and authors to bring you the best titles across all genres.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-8 w-8 mb-2" />
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're committed to promoting literacy, supporting authors, and fostering a love of reading. Every
                  purchase helps us contribute to literacy programs and educational initiatives.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-6">
              Founded in 2020, BookStore began as a small independent bookshop with a simple vision: to connect readers
              with the books they love. What started as a passion project has grown into a comprehensive online
              bookstore serving customers around the globe.
            </p>
            <p className="text-muted-foreground">
              Today, we're proud to offer an extensive collection of books across all genres, from bestselling novels to
              academic texts, children's books to rare collectibles. Our team of book enthusiasts works tirelessly to
              curate selections that inspire, educate, and entertain.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
