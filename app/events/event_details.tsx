import CustomButton from "@/components/custom_button";
import InviteMatches from "@/components/invite";
import { useToast } from "@/components/toast_provider";
import { useAppContext } from "@/context/app_context";
import { apiCall } from "@/utils/api";
import { color, font } from "@/utils/constants";
import { AddCalender, Calender, Users } from "@/utils/SvgIcons";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function EventDetails({ route }: any) {
  const params = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [isAttending, setIsAttending] = useState(false);
  const [showInviteMatches, setShowInviteMatches] = useState(false);
  const { user } = useAppContext();
  const { showToast } = useToast();
  const [isRSVPing, setIsRSVPing] = useState(false);
  useEffect(() => {
    if (params.event) {
      try {
        const eventData = JSON.parse(params.event as string);
        setEvent(eventData);
        setIsAttending(eventData.isAttending || false);
      } catch (error) {
        console.error("Error parsing event data:", error);
        router.back();
      }
    } else {
      console.error("No event data provided");
      router.back();
    }
  }, [params.event]);

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading event...</Text>
      </View>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    console.log("Share event");
    // Handle share functionality
  };

  const handleGetDirections = () => {
    console.log("Get directions to:", event.location);
    // Open maps app with location
  };

  const handleAddToCalendar = () => {
    console.log("Add to calendar:", event.title);
    // Add event to device calendar
  };

  const handleInviteMatches = () => {
    setShowInviteMatches(true);
  };

  const handleSendInvites = (selectedMatches: any) => {
    console.log("Sending invites to:", selectedMatches);
    // Handle sending invites logic here
    // You could show a success message or navigate somewhere
  };

  const handleRSVP = async () => {
    if (!user?.user_id) {
      showToast("User session expired. Please login again.", "error");
      return;
    }

    setIsRSVPing(true);

    try {
      const formData = new FormData();
      formData.append("type", "add_data");
      formData.append("user_id", user.user_id);
      formData.append("table_name", "event_rsvp");
      formData.append("event_id", event.id.toString());

      const response = await apiCall(formData);

      if (response.result) {
        setIsAttending(!isAttending);
        showToast(isAttending ? "Left event" : "RSVP confirmed!", "success");
      } else {
        showToast(response.message || "Failed to RSVP", "error");
      }
    } catch (error) {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsRSVPing(false);
    }
  };

  const handleViewAllAttendees = () => {
    console.log("View all attendees");
    // Navigate to attendees list
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.image }} style={styles.eventImage} />

        {/* Header Overlay */}
        <SafeAreaView style={styles.headerOverlay}>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={24} color={color.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Feather name="share-2" size={24} color={color.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title and Category */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={color.gray14} />
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>{formatDate(event.date)}</Text>
              <Text style={styles.infoSubtext}>{formatTime(event.date)}</Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={color.gray14} />
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>{event.location}</Text>
              <TouchableOpacity onPress={handleGetDirections}>
                <Text style={styles.directionsText}>Get directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Organizer */}
        <View style={styles.infoSection}>
          <View style={styles.organizerRow}>
            <Image
              source={{ uri: event.organizer.image }}
              style={styles.organizerImage}
            />
            <View style={styles.organizerInfo}>
              <Text style={styles.organizerLabel}>Organized by</Text>
              <View style={styles.organizerNameRow}>
                <Text style={styles.organizerName}>{event.organizer.name}</Text>
                {event.organizer.verified && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color="#10B981"
                    style={styles.verifiedIcon}
                  />
                )}
              </View>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Who's Going Section */}
        <View style={styles.section}>
          <View style={styles.attendeesHeader}>
            <Text style={styles.sectionTitle}>{"Who's going"}</Text>
            <View style={styles.attendeesCount}>
              <Feather name="users" size={16} color={color.gray55} />
              <Text style={styles.attendeesCountText}>
                {event.totalAttendees} attending
              </Text>
            </View>
          </View>

          <View style={styles.attendeesRow}>
            <View style={styles.attendeesList}>
              {event.attendees.map((attendee: any, index: number) => (
                <Image
                  key={attendee.id}
                  source={{ uri: attendee.image }}
                  style={[
                    styles.attendeeImage,
                    { marginLeft: index > 0 ? -8 : 0 },
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity onPress={handleViewAllAttendees}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <CustomButton
            title="Add to Calendar"
            variant="secondary"
            style={{ width: "48%" }}
            icon={<AddCalender />}
            onPress={handleAddToCalendar}
          />
          <CustomButton
            title="Invite Matches"
            variant="secondary"
            style={{ width: "48%" }}
            icon={<Users />}
            onPress={handleInviteMatches}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* RSVP Button */}
      <View style={styles.rsvpContainer}>
        <CustomButton
          title={
            isRSVPing ? "Processing..." : isAttending ? "Going" : "RSVP Now"
          }
          icon={<Calender />}
          onPress={handleRSVP}
          isDisabled={isRSVPing}
          isLoading={isRSVPing}
        />
      </View>

      {/* Invite Matches Modal */}
      <InviteMatches
        visible={showInviteMatches}
        onClose={() => setShowInviteMatches(false)}
        onSendInvites={handleSendInvites}
        eventTitle={event.title}
        eventId={event.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: font.regular,
    color: color.gray55,
  },
  imageContainer: {
    height: SCREEN_HEIGHT * 0.35,
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    backgroundColor: color.white,
    marginTop: -20,
  },
  titleSection: {
    padding: 20,
    paddingBottom: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  eventTitle: {
    fontSize: 24,
    fontFamily: font.semiBold,
    color: color.black,
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: color.primary100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: font.medium,
    color: color.primary,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    fontFamily: font.medium,
    color: color.gray55,
  },
  infoSubtext: {
    fontSize: 14,
    fontFamily: font.regular,
    color: color.gray55,
    marginTop: 2,
  },
  directionsText: {
    fontSize: 14,
    fontFamily: font.medium,
    color: color.primary,
    marginTop: 4,
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  organizerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerLabel: {
    fontSize: 12,
    fontFamily: font.regular,
    color: color.gray55,
    marginBottom: 2,
  },
  organizerNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  organizerName: {
    fontSize: 14,
    fontFamily: font.semiBold,
    color: color.black,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: font.semiBold,
    color: color.black,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: font.regular,
    color: color.gray55,
    lineHeight: 20,
  },
  attendeesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  attendeesCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendeesCountText: {
    fontSize: 14,
    fontFamily: font.regular,
    color: color.gray55,
    marginLeft: 4,
  },
  attendeesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attendeesList: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendeeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: color.white,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: font.medium,
    color: color.primary,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: color.white,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: font.medium,
    color: color.black,
    marginLeft: 6,
  },
  bottomSpacing: {
    height: 100,
  },
  rsvpContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.white,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 34,
  },
  rsvpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5FB3D4",
    paddingVertical: 16,
    borderRadius: 12,
  },
  rsvpButtonActive: {
    backgroundColor: "#10B981",
  },
  rsvpIcon: {
    marginRight: 8,
  },
  rsvpButtonText: {
    fontSize: 16,
    fontFamily: font.semiBold,
    color: color.white,
  },
});
