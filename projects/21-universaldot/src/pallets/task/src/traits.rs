pub trait Organization<OrganizationId> {
	/// Determines whether an organization with the supplied identifier exists.
	fn exists(id: &OrganizationId) -> bool;
}
