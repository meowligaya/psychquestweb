import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mentalHealthServices = [
  {
    id: 1,
    name: "Mariveles Municipal Health Office",
    type: "Government Health Center",
    address: "Municipal Building, Mariveles, Bataan",
    phone: "(047) 935-2234",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    services: ["Mental Health Counseling", "Crisis Intervention", "Health Education"],
    coordinates: { lat: 14.4325, lng: 120.4864 },
    description: "Primary mental health services for the municipality"
  },
  {
    id: 2,
    name: "Bataan General Hospital",
    type: "Public Hospital",
    address: "Roman Superhighway, Balanga, Bataan",
    phone: "(047) 791-2131",
    hours: "24/7 Emergency Services",
    services: ["Psychiatric Services", "Emergency Mental Health", "Inpatient Care"],
    coordinates: { lat: 14.6760, lng: 120.5364 },
    description: "Full psychiatric and mental health services"
  },
  {
    id: 3,
    name: "Mariveles High School Guidance Office",
    type: "School Counseling",
    address: "A. Bonifacio St, Mariveles, Bataan",
    phone: "(047) 935-1234",
    hours: "Mon-Fri: 7:00 AM - 4:00 PM (School Days)",
    services: ["Student Counseling", "Family Therapy", "Academic Support"],
    coordinates: { lat: 14.4298, lng: 120.4851 },
    description: "Counseling services for students and families"
  },
  {
    id: 4,
    name: "Bagac Community Health Center",
    type: "Community Health",
    address: "National Road, Bagac, Bataan",
    phone: "(047) 481-2345",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    services: ["Basic Counseling", "Health Screening", "Referral Services"],
    coordinates: { lat: 14.6025, lng: 120.4364 },
    description: "Community-based mental health support"
  },
  {
    id: 5,
    name: "DOH-CHD III Mental Health Program",
    type: "Regional Health Office",
    address: "Regional Government Center, San Fernando, Pampanga",
    phone: "(045) 455-1234",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    services: ["Mental Health Programs", "Training", "Policy Support"],
    coordinates: { lat: 15.0392, lng: 120.6897 },
    description: "Regional mental health program coordination"
  },
  {
    id: 6,
    name: "Softnet Information Technology Center",
    type: "Community Resource Center",
    address: "SFB No. 8, FAB, Mariveles, Bataan",
    phone: "(047) 935-5678",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM",
    services: [
      "Digital Mental Health Resources", 
      "Community Training", 
      "Referral Assistance"
    ],
    coordinates: { lat: 14.4362, lng: 120.4956 },
    description: "Provides access to mental health information and digital support for the Mariveles community"
  }
];

export default function LocalServices() {
  const navigate = useNavigate();

  const openInMaps = (service: typeof mentalHealthServices[0]) => {
    const query = encodeURIComponent(`${service.name}, ${service.address}`);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(googleMapsUrl, '_blank');
  };

  const getServiceTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'government health center':
        return 'bg-blue-100 text-blue-800';
      case 'public hospital':
        return 'bg-red-100 text-red-800';
      case 'school counseling':
        return 'bg-green-100 text-green-800';
      case 'community health':
        return 'bg-purple-100 text-purple-800';
      case 'regional health office':
        return 'bg-orange-100 text-orange-800';
      case 'community resource center':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gradient-ocean font-nunito">
            Local Support Services 🗺️
          </h1>
          <p className="text-muted-foreground">
            Mental health services in Mariveles, Bataan and surrounding areas
          </p>
        </div>
      </div>

      {/* Emergency Notice */}
      <Card className="island-card mb-6 border-red-200">
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Emergency Contacts</h3>
          </div>
          <p className="text-red-700 text-sm mb-2">
            If you're experiencing a mental health crisis, please reach out immediately:
          </p>
          <div className="space-y-1 text-sm">
            <p><strong>National Crisis Hotline:</strong> 1553 (24/7)</p>
            <p><strong>Emergency Services:</strong> 911</p>
            <p><strong>Bataan Emergency:</strong> (047) 791-2131</p>
          </div>
        </div>
      </Card>

      {/* Services List */}
      <div className="grid gap-6">
        {mentalHealthServices.map((service) => (
          <Card key={service.id} className="island-card">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold font-nunito mb-2">{service.name}</h3>
                  <Badge className={getServiceTypeColor(service.type)} variant="secondary">
                    {service.type}
                  </Badge>
                </div>
                <Button
                  onClick={() => openInMaps(service)}
                  className="ocean-button"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open in Maps
                </Button>
              </div>

              <p className="text-muted-foreground mb-4">{service.description}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-primary" />
                    <span className="text-sm">{service.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm">{service.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm">{service.hours}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Services Offered:</h4>
                  <div className="space-y-1">
                    {service.services.map((serviceOffered, index) => (
                      <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                        {serviceOffered}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Click "Open in Maps" to get directions and see the exact location. 
                  It's recommended to call ahead to confirm availability and schedule appointments.
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Resources */}
      <Card className="island-card mt-8">
        <div className="p-6">
          <h3 className="text-xl font-bold font-nunito mb-4">Additional Resources</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Online Support</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Department of Health Mental Health Programs</li>
                <li>• National Center for Mental Health</li>
                <li>• Philippine Mental Health Association</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Self-Help Resources</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Mindfulness and meditation apps</li>
                <li>• Mental health first aid courses</li>
                <li>• Peer support groups</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}